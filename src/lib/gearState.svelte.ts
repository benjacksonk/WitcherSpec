import { toIdString } from '$lib/common.svelte';

import { Gear, GearSlot } from "$lib/types";
import gearDoc from "$lib/gearData.csv?raw";
import Papa from "papaparse";

const baseGearData = generateGearData();
export const gearData = $state(baseGearData);

function generateGearData() {

	return processParsedGearData(Papa.parse<Gear>(gearDoc, { header: true }).data);
	
	/**
	Papa.parse<Gear>(gearDoc, {
		header: true,
		complete: results => processParsedGearData(results.data)
	});
	/**/

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

		let gearArraysBySlotId = Object.groupBy(
			gears,
			gear => gear.slotId
		);

		let gearSlots: GearSlot[] = Object.entries(gearArraysBySlotId).map(
			([slotId, slotGears]) => {
				return new GearSlot(slotId, slotGears);
			}
		);

		return {
			slots: gearSlots,
			gears: gears,
		};
	}
}