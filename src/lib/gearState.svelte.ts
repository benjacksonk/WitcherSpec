import { toIdString } from '$lib/common.svelte';
import { type Gear, GearSlot } from "$lib/types.svelte";
import gearDoc from "$lib/gearData.csv?raw";
import Papa from "papaparse";


const baseGearData = generateGearData();
export const gearData = $state(baseGearData);


function generateGearData() {

	return processParsedGearData(Papa.parse<Gear>(gearDoc, { header: true }).data);

	// Papa.parse<Gear>(gearDoc, { header: true, complete: results => processParsedGearData(results.data) });

	function processParsedGearData(gears: Gear[]) {

		gears.forEach((gear) => {
			gear.id = `${gear.slotId}-${toIdString(gear.name)}`;
			gear.iconPath = gear.name === "None" ? "" : `images/gear/${gear.slotId}-${
				gear.name.toLowerCase().replaceAll(
					new RegExp(String.raw`[^\w-]|${gear.slotId}|${"sword"}`, 'gi'),
					''
				)
			}.webp`;
		});

		let slotIds = gears
			.map(gear => gear.slotId)
			.reduce((a: string[], b: string): string[] => a.includes(b) ? a : [...a, b], []);

		let gearArraysBySlotId = slotIds.map(slotId => gears.filter(gear => gear.slotId === slotId));

		let gearSlots: GearSlot[] = gearArraysBySlotId.map(
			(slotGears) => {
				return new GearSlot(slotGears[0].slotId, slotGears);
			}
		).sort((a,b) => {
			return (a.id === "steel" || a.id === "silver") && (b.id !== "steel" && b.id !== "silver") ?
				1 : (b.id === "steel" || b.id === "silver") && (a.id !== "steel" && a.id !== "silver") ?
					-1 : a > b ? 1 : a < b ? -1 : 0;
		});

		return {
			slots: gearSlots,
			gears: gears,
		};
	}
}