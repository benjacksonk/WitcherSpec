import { type GearData, Gear, GearSlot } from "$lib/types.svelte";
import gearDoc from "$lib/gearData.csv?raw";
import Papa from "papaparse";

class GearState {
	slots: GearSlot[] = $state([]);
	steelSlot: GearSlot = $state(new GearSlot("noId", []));
	silverSlot: GearSlot = $state(new GearSlot("noId", []));

	get statsTotal() {
		return this.slots
			.flatMap(slot => slot.currentGear?.stats ?? [])
			.reduce(
				(a, b) => {
					b.forEach((value, key) => a.set(key, ((a.get(key) ?? 0) + (b.get(key) ?? 0))));
					return a;
				},
				new Map<string, number>()
			);
	}

	constructor(gearSlots: GearSlot[]) {
		this.slots = gearSlots;
		this.steelSlot = gearSlots.find(slot => slot.id === "steel") ?? this.steelSlot;
		this.silverSlot = gearSlots.find(slot => slot.id === "silver") ?? this.silverSlot;
	}
}

export const gearState = $state(generateGearStateData());

function generateGearStateData() {

	// non-async
	let gears: Gear[] =
		Papa.parse<GearData>(gearDoc, {
		header: true,
		dynamicTyping: true,
		skipEmptyLines: true,
	}).data.map(gearData => new Gear(gearData));
	
	return processParsedGearData(gears);
	
	/* async version *
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
	/**/

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

		return new GearState(
			gearSlots
		);
	}
}