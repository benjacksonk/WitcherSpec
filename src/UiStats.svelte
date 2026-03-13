<script lang="ts">
    import { getContext } from "svelte";
    import { type GeraltContext } from "$lib/types.svelte";

    const { gearState } = getContext<GeraltContext>("geralt");

    let stats = $derived.by(() => {
        let statMap = new Map<string, { steel: number, silver: number }>();

        gearState.statsTotal.forEach((statValue, statKey) => {
            statMap.set(statKey, {
                steel: statValue - (gearState.silverSlot.currentGear.stats.get(statKey) ?? 0),
                silver: statValue - (gearState.steelSlot.currentGear.stats.get(statKey) ?? 0)
            })
        })

        return statMap;
    });
    
    let summarizedStats = $derived.by(() => {
        let sumStats = new Map<string, { steel: number, silver: number }>();
        
        stats.forEach((value, key) => {
            let keyLower = key.toLowerCase();
            
            if (["fast","strong"].some(str => keyLower.includes(str))) {
                let agnosticKey = key.replace("Fast","").replace("Strong","").trim();
                let agnosticValue = stats.get(agnosticKey) ?? { steel: 0, silver: 0 };
                sumStats.set(key, {
                    steel: value.steel + agnosticValue.steel,
                    silver: value.silver + agnosticValue.silver
                });
            }
            else if (["aard","axii","igni","quen","yrden"].some(str => keyLower.includes(str))) {
                let agnosticKey = "Signs";
                let agnosticValue = stats.get(agnosticKey) ?? { steel: 0, silver: 0 };
                sumStats.set(key, {
                    steel: value.steel + agnosticValue.steel,
                    silver: value.silver + agnosticValue.silver
                });
            }
            else if (!["attack","crit","signs"].some(str => keyLower.includes(str))) {
                sumStats.set(key, value);
            }
        });
        
        return sumStats;
    });
</script>



<div class="UiStats">
<!--    <span></span>-->
<!--    <span>Silver</span>-->
<!--    <span>Steel</span>-->
<!--    <span></span>-->
<!--    <span></span>-->
    {#each summarizedStats.entries() as [statKey, statVal]}
    <div class="statLine">
        <div class="totalPerSword">
            <span class="plus right">+</span>
            <span class="value right">{(statKey.includes("oxic") || statKey.includes("rmor") ? statVal.steel : 100 * statVal.steel).toFixed(0)}</span>
        </div>
        <div class="totalPerSword">
            <span class="value right">{(statKey.includes("oxic") || statKey.includes("rmor") ? statVal.silver : 100 * statVal.silver).toFixed(0)}</span>
            <span class="unitLabel">{statKey.includes("oxic") || statKey.includes("rmor") ? "pts" : "%"}</span>
        </div>

        <span class="statLabel">{statKey}</span>
    </div>
    {/each}
</div>



<style>
    .UiStats {
        contain: size;

        min-height: 0;

            height:
            auto
            /* 0  */
            /* stretch */
            /* min-content */
            /* fit-content */
            /* max-content */
            /* calc-size(max-content, max(size, 100%)) */
            /* 100px */
            /* 100% */
            
            /* calc-size(
                max-content, 
                (size * (1 - sign(100%)))
            ) */
            ;

        max-height: 100%;

        background-color: #233;
        
        grid-column: 1 / -1;
        display: grid;
        flex-flow: column;
        grid-template-columns: subgrid;
        grid-auto-rows: minmax(0,1fr);

        gap: 0.4em 1px;
        /* padding: 10px 0; */
        overflow: clip auto;
    }

    .statLine {
        grid-column: 1 / -1;
        width: 100%;

        /* contain: size; */

        min-height: 0;
        height:
        auto
        /* 100% */
        /* 0 */
        ;

        display: grid;
        grid-template-columns: subgrid;
        grid-template-rows: subgrid;
    }
    
    .totalPerSword > *,
    .statLabel {
        margin: 0 0.2em;
    }
    
    .right {
        text-align: right;
        align-self: end;
    }
    
    .plus,
    .unitLabel {
        color: var(--color-grey-3);
    }
    
    .statLabel {
        grid-column: span 4;
        /*margin-left: 1em;*/
    }
</style>