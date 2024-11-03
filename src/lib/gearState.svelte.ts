import { Gear, GearSlot } from "$lib/types.svelte";
import gearDoc from "$lib/gearData.csv?raw";
import Papa from "papaparse";


export async function generateGearStateData(): Promise<ReturnType<typeof processParsedGearData>> {

	// return processParsedGearData(Papa.parse<GearData>(gearDoc, { header: true }).data); // non-async
	
	type GearData = {
		id: string,
		slotId: string,
		name: string,
		iconPath: string,
		stats: {}
	};
	
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

	function processParsedGearData(gearDataArray: GearData[]) {

		let slotIds = gearDataArray
			.map(gear => gear.slotId)
			.reduce((a: string[], b: string): string[] => a.includes(b) ? a : [...a, b], []);

		let gearSlots = 
			slotIds.map(slotId => {
				let slotGears = gearDataArray
					.filter(gearData => gearData.slotId === slotId)
					.map(gearData => {
						let gearStats = Object.fromEntries(
							Object.entries(gearData).filter(([id, value]) => {
								return !["name", "slotId", "schoolId", "glyphSlots", "runeSlots"].includes(id)
							})
						);
						return new Gear(gearData.name, gearData.slotId, gearStats);
					});
				
				return new GearSlot(slotId, slotGears);
			}
		).sort((a,b) => {
			return (a.id === "steel" || a.id === "silver") && (b.id !== "steel" && b.id !== "silver") ?
				1 : (b.id === "steel" || b.id === "silver") && (a.id !== "steel" && a.id !== "silver") ?
					-1 : a > b ? 1 : a < b ? -1 : 0;
		});

		return {
			slots: gearSlots
		};
	}
}