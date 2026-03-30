import Papa from "papaparse";
import statsDataSource from "$lib/statData.csv?raw";
import type { StatEntitySpec } from "./types.svelte";

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

export function toIdString(str: string) {
	return str.toLowerCase().replaceAll(/\W/g,'');
}

export function toTitleCase(str: string) {
	return str.replaceAll(/(\b\w)/g, (match, it) => it.toUpperCase());
}

export function capitalizeFirst(str: string) {
	return str.replace(/(\b\w)/, (match, it) => it.toUpperCase());
}