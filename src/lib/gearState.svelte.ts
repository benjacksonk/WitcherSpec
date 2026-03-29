import Papa from "papaparse";
import statsDataSource from "$lib/statData.csv?raw";
import { GearSlot, type StatEntitySpec } from "./types.svelte";

export const allStatEntitySpecs = Papa.parse<StatEntitySpec>(statsDataSource, {
	header: true,
	dynamicTyping: true,
	skipEmptyLines: true,
}).data;

const statNames = allStatEntitySpecs.filter(spec => spec.kind.toLowerCase() === "stat").map(spec => spec.name);

export function getStatsFromSpec(statEntitySpec: StatEntitySpec) {	
	return new Map(statNames.map(name => {
		let val = Number(Object.entries(statEntitySpec).find(([k, v]) => k === name)?.[1]);
		return [name, Number.isNaN(val) ? 0 : val];
	}));
}

export const GearState = $state(generateGearStateData(allStatEntitySpecs));

function generateGearStateData(gearSpecs: StatEntitySpec[]) {
	let gearSlotSpecs = gearSpecs.filter(spec => spec.kind.toLowerCase() === "gear");

	let gearSlots 
	= gearSlotSpecs.map(statEntitySpec => 
		new GearSlot(statEntitySpec, gearSpecs.filter(gearSpec => gearSpec.kind === statEntitySpec.name))
	).sort((a,b) => {
		let swordStrings = ["steel", "silver"];
		let aIsSword = swordStrings.includes((a.description ?? a.name).toLowerCase());
		let bIsSword = swordStrings.includes((b.description ?? b.name).toLowerCase());
		return (aIsSword && !bIsSword) ? -1 : (bIsSword && !aIsSword) ? 1 : a > b ? 1 : a < b ? -1 : 0;
	});

	return {
		slots: gearSlots,
		steelSlot: gearSlots.find(slot => slot.name.toLowerCase().includes("steel")) ?? 
			new GearSlot({ name: "Steel_Sword", description: "Steel", kind: "Gear", rank: 0 }, []),
		silverSlot: gearSlots.find(slot => slot.name.toLowerCase().includes("silver")) ?? 
			new GearSlot({ name: "Silver_Sword", description: "Silver", kind: "Gear", rank: 0 }, []),

		get statsTotal() {
			return this.slots
			.flatMap(slot => slot.currentGear.stats)
			.reduce((a, b) => {
				b.forEach((value, key) => a.set(key, ((a.get(key) ?? 0) + (b.get(key) ?? 0))));
				return a;
			});
		}
	}
}