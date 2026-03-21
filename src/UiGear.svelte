<script lang="ts">
	import { type Gear } from '$lib/types.svelte';
	
	let { 
		gear,
		label = ""
	}: {
		gear: Gear;
		label?: string;
	} = $props();

    const uid = $props.id();
    const tooltipId = $derived(`gear-${uid}-tooltip`);

    let relevantStatEntries 
    = $derived(Array.from(gear.stats.entries().filter(([statKey, statVal]) => statVal != 0 || gear.slot.currentGear.stats.get(statKey) != statVal)));
</script>



<button class="UiGear" interestfor={tooltipId}>
	<img src={gear.iconPath} alt={gear.name} class:hidden={gear.name === "None"}/>
	<div class="name shadowText">
		<span style:font-style={"italic"}>
			{gear.name.includes("Leather") ? "Kaer Morhen" : gear.name.split(" ")[0]}
		</span>
		{#if label !== ""}
        <span>{label}</span>
		{/if}
	</div>
</button>



{#if relevantStatEntries.length > 0}
<div id={tooltipId} popover="hint" class="gearStatsTooltip">
    <span class="gearStatsTooltipName">{gear.name}</span>

    <div class="gearStatsTooltipData">
        {#each relevantStatEntries as [statKey, statVal]}
        <div class="tooltipStatLine">
            <div class="tooltipStatDiff">
                {#if gear.slot.currentGear.stats.get(statKey) != statVal}
                <span style:color={statVal < gear.slot.currentGear.stats.get(statKey)! ? "var(--color-combat-2)" : "var(--color-alchemy-2)"}>            
                    {#if (statVal - gear.slot.currentGear.stats.get(statKey)!) > 0}+{/if}{((statVal - gear.slot.currentGear.stats.get(statKey)!)* (statKey.includes("oxic") || statKey.includes("rmor") ? 1 : 100)).toFixed(0)}{" |"}
                </span>
                {/if}
            </div>

            <div class="tooltipStatBase">
                <span class="tooltipStatValue">{(statKey.includes("oxic") || statKey.includes("rmor") ? statVal : 100 * statVal).toFixed(0)}</span>
                <span class="tooltipStatUnit">{statKey.includes("oxic") || statKey.includes("rmor") ? "pts" : "%"}</span>
                <span class="tooltipStatName">{statKey}</span>
            </div>
        </div>
        {/each}
    </div>
</div>
{/if}



<style>
    .UiGear {
        interest-delay: 0s;
        width: 80px;
        display: grid;
        grid-auto-flow: row;
        grid-auto-rows: 100%;
        justify-content: stretch;
        justify-items: center;
        background-color: var(--color-grey-1);
        padding: 0;
        border: none;
        border-radius: 0;
        
        span {
            text-align: center;
            width: 100%;
            height: 1.4lh;
            align-content: center;
            font-size: var(--h4-size);
            color: white;
            font-weight: bold;
        }
        span:first-of-type {
            background: linear-gradient(in oklab to bottom,
            var(--color-grey-2),
            transparent
            );
            font-family: var(--h-font);
            font-size: var(--h5-size);
        }
        span:not(:first-of-type) {
            background: linear-gradient(in oklab to bottom,
            transparent,
            var(--color-grey-1),
            transparent
            );
        }
    }

    .gearStatsTooltip {
        width: max-content;
        position: absolute;
        top: anchor(100%);
        left: anchor(50%);
        translate: -50%;
        border: 1px solid white;
        background-color: #222;
        color: white;
        padding: 1em;
        flex-flow: column nowrap;
        gap: 0.5em 0em;

        &:popover-open {
            display: flex;
        }
    }

    .gearStatsTooltipName {
        font-weight: bold;
    }

    .gearStatsTooltipData {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, max-content));
    }

    .tooltipStatLine {
        grid-column: span 5;
        display: grid;
        grid-template-columns: subgrid;
    }

    .tooltipStatDiff, 
    .tooltipStatBase {
        display: grid;
        grid-template-columns: subgrid;
    }
    .tooltipStatBase {
        grid-column: span 3;
    }
    .tooltipStatDiff, 
    .tooltipStatBase,
    .tooltipStatValue {
        text-align: right;
    }
    .tooltipStatUnit,
    .tooltipStatName {
        text-align: left;
    }
    .tooltipStatValue {
        margin-left: 0.5em;
    }
    .tooltipStatUnit {
        margin-left: 0.25em;
    }
    .tooltipStatName {
        margin-left: 1em;
    }

    img {
        width: 64px;
        height: 128px;
    }

    .name {
        width: 100%;
        height: 100%;
        position: relative;
        top: -100%;
        margin-bottom: -100%;
        display: grid;
        grid-auto-flow: row;
        grid-auto-rows: max-content;
        align-content: space-between;
        justify-items: center;
    }
</style>