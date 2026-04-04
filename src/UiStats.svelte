<script lang="ts">
    import { getContext } from "svelte";
    import { type GeraltContext } from "$lib/types.svelte";

    const { gearState } = getContext<GeraltContext>("geralt");

    let stats = $derived.by(() => {
        let statMap = new Map<string, { steel: number, silver: number }>();

        gearState.statsTotal.forEach((statValue, statKey) => {
            statMap.set(statKey, {
                steel: statValue - ((gearState.silverSlot.currentGear.stats.get(statKey) ?? 0)),
                silver: statValue - ((gearState.steelSlot.currentGear.stats.get(statKey) ?? 0))
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
    {#each summarizedStats.entries() as [statKey, statVal]}
    <p class="statLine">
        <span class="totalPerSword silver">
            <span class="plus">+</span>
            <span class="value">{(statKey.includes("oxic") || statKey.includes("rmor") ? statVal.steel : 100 * statVal.steel).toFixed(0)}</span>
        </span>
        
        <span class="totalPerSword steel">
            <span class="value">{(statKey.includes("oxic") || statKey.includes("rmor") ? statVal.silver : 100 * statVal.silver).toFixed(0)}</span>
            <span class="unitLabel">{statKey.includes("oxic") || statKey.includes("rmor") ? "pts" : "%"}</span>
        </span>

        <span class="statLabel">{statKey}</span>
    </p>
    {/each}
</div>



<style>
    .UiStats {
        grid-column: 1 / -1;
        background-color: var(--color-grey-22);
        display: grid;
        flex-flow: column;
        grid-template-columns: subgrid;
        align-content: stretch;
    }

    .statLine {
        grid-column: 1 / -1;
        width: 100%;
        display: grid;
        grid-template-columns: subgrid;
        grid-template-rows: subgrid;
        align-items: center;
        font-weight: 500;
        color: var(--color-grey-0);
    }
    
    .totalPerSword > *,
    .statLabel {
        margin: 0 0.2em;
    }
    .statLabel {
        grid-column: span 4;
        margin-left: 0.5em;
    }

    .totalPerSword {
        grid-column: span 2;
        display: grid;
        grid-template: subgrid / subgrid;
        /* background-color: oklch(from var(--color-key-22) l 0.03 h); */
        align-items: center;

        &:first-child .value {
            margin-right: 1em;
        }

        &.silver,
        &.steel {
            background-color: oklch(from var(--color-key-22) l 0.00618 h);
        }
    }

    .plus {
        margin-left: 0.5em;
    }
    
    .plus,
    .value,
    .unitLabel {
        display: grid;
        grid-template: subgrid / subgrid;
        align-items: center;
    }
    
    .plus,
    .unitLabel {
        color: var(--color-grey-2);
    }

    .value {
        text-align: right;
        color: oklch(from var(--color-key-0) l calc(c * 0.5) h);
    }
</style>