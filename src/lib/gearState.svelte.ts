import { Gear, GearSlot } from "$lib/types.svelte";
import gearDoc from "$lib/gearData.csv?raw";
import Papa from "papaparse";

export const gearState = $state(generateGearStateData());

function generateGearStateData() {
	type GearData = {
		id: string,
		slotId: string,
		name: string,
		iconPath: string,
	};

	// non-async
	let gears = Papa.parse<GearData>(gearDoc, {
		header: true,
		dynamicTyping: true
	}).data.map(gearData => {
		let statEntries: [string, number][] = Object.entries(gearData)
			.filter(([key, value]) => {
				return !["name", "slotId", "schoolId", "glyphSlots", "runeSlots"].includes(key);
			})
			.map(([key, value]) => {
				return [key, Number(value)]
			});
		
		return new Gear(gearData.name, gearData.slotId, statEntries);
	});
	
	return processParsedGearData(gears);
	
	/* // async version
	const gearState: Promise<ReturnType<typeof processParsedGearData>> = $state(
		new Promise((resolve) => {
			Papa.parse<GearData>(gearDoc, {
				header: true,
				dynamicTyping: true,
				worker: true,
				complete: (results) => {
					resolve(processParsedGearData(results.data));
				},
			});
		})
	);
	
	return gearState;
	*/

	function processParsedGearData(gears: Gear[]) {

		let slotIds = gears
			.map(gear => gear.slotId)
			.reduce((a: string[], b: string): string[] => a.includes(b) ? a : [...a, b], []);

		let gearSlots = slotIds.map(slotId => {
			return new GearSlot(slotId, gears.filter(gear => gear.slotId === slotId));
		}).sort((a,b) => {
			return (a.id === "steel" || a.id === "silver") && (b.id !== "steel" && b.id !== "silver") ?
				1 : (b.id === "steel" || b.id === "silver") && (a.id !== "steel" && a.id !== "silver") ?
					-1 : a > b ? 1 : a < b ? -1 : 0;
		});

		return {
			slots: gearSlots
		};
	}
}