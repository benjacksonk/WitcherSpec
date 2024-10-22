<script lang="ts">
    import GearSlots from '../GearSlots.svelte';
    // import { gearData } from '$lib/gearState.svelte.js';

    /**/
    import { toIdString } from '$lib/common.svelte';

    import { Gear, GearSlot } from "$lib/types";
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
            );

            return {
                slots: gearSlots,
                gears: gears,
            };
        }
    }
    /**/
</script>



<main>
    <GearSlots bind:gearSlots={gearData.slots}/>
</main>



<style>
    main {
        width: 100cqw;
        height: 100cqh;
        display: flex;
        flex-flow: row wrap;
        align-content: start;
        background-color: var(--color-key-10);
    }
</style>