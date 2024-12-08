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


<div class="StatsUI">
    <span></span>
    <span>Steel</span>
    <span>Silver</span>
    <span></span>
    <span></span>
    {#each summarizedStats.entries() as [statKey, statVal]}
        <span class="plus right">+</span>
        <span class="value right">{(statKey.includes("oxic") || statKey.includes("rmor") ? statVal.steel : 100 * statVal.steel).toFixed(0)}</span>
        <span class="value right">{(statKey.includes("oxic") || statKey.includes("rmor") ? statVal.silver : 100 * statVal.silver).toFixed(0)}</span>
        <span class="unitLabel">{statKey.includes("oxic") || statKey.includes("rmor") ? "pts" : "%"}</span>
        <span class="statLabel">{statKey}</span>
    {/each}
</div>



<style>
    .StatsUI {
        display: grid;
        grid-template-columns: 30px 56px 56px 28px max-content;
        gap: 0.4em 1px;
        padding: 10px 0;
    }
    
    .right {
        text-align: right;
        align-self: end;
    }
    
    .plus,
    .unitLabel {
        color: var(--color-grey-3);
    }
    
    .StatsUI > * {
        margin: 0 0.2em;
    }
    
    .statLabel {
        /*margin-left: 1em;*/
    }
</style>