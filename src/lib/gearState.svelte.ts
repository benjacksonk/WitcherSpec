import { type GearData, Gear, GearSlot } from "$lib/types.svelte";
import gearDoc from "$lib/gearData.csv?raw";
import Papa from "papaparse";

export const gearState = $state(generateGearStateData());

function generateGearStateData() {

	// non-async
	let gearDatas: GearData[] =
		Papa.parse<GearData>(gearDoc, {
		header: true,
		dynamicTyping: true,
		skipEmptyLines: true,
	}).data;
	
	return processParsedGearData(gearDatas);
	
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

	function processParsedGearData(gearDatas: GearData[]) {

		let slotIds = gearDatas
			.map(gearData => gearData.slotId)
			.reduce((a: string[], b: string): string[] => a.includes(b) ? a : [...a, b], []);

		let gearSlots 
		= slotIds
		.map(slotId => new GearSlot(slotId, gearDatas.filter(gearData => gearData.slotId === slotId)))
		.sort((a,b) => {
			return (a.id === "steel" || a.id === "silver") && (b.id !== "steel" && b.id !== "silver") ?
				-1 : (b.id === "steel" || b.id === "silver") && (a.id !== "steel" && a.id !== "silver") ?
					1 : a > b ? 1 : a < b ? -1 : 0;
		});

		return {
			slots: gearSlots,
			steelSlot: gearSlots.find(slot => slot.id === "steel") ?? new GearSlot("noId", []),
			silverSlot: gearSlots.find(slot => slot.id === "silver") ?? new GearSlot("noId", []),

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
		}
	}
}