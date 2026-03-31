<script lang="ts">
	import { type Gear } from '$lib/types.svelte';
	
	let { 
		gear
	}: {
		gear: Gear;
	} = $props();

    const uid = $props.id();
    const tooltipId = $derived(`gear-${uid}-tooltip`);

    let label = $derived(gear.slot.description ?? gear.slot.name);

    let relevantStatEntries 
    = $derived(Array.from(gear.stats.entries().filter(([statKey, statVal]) => 
        statVal !== 0 || gear.slot.currentGear.stats.get(statKey) !== statVal
    )));
</script>



<button class="UiGear" interestfor={tooltipId}>
	<img src={gear.iconPath} alt={gear.name} class:hidden={gear.name === "None"}/>
	
    <div class="texts">
		<p class="gearNickname shadowText">{(gear.styleName ?? gear.name).replaceAll("_"," ")}</p>

		{#if label !== ""}
        <p class="slotLabel shadowText">{label}</p>
		{/if}
	</div>
</button>



{#if relevantStatEntries.length > 0}
<div id={tooltipId} popover="hint" 
class="tooltip gearStatsTooltip"
class:silver={gear.slot.name.toLowerCase().includes("silver")}
class:steel={gear.slot.name.toLowerCase().includes("steel")}
>
    <h4 class="gearStatsTooltipName">{gear.name.replaceAll("_", " ")}</h4>

    <div class="gearStatsTooltipData">
        {#each relevantStatEntries as [statKey, statVal]}
        <div class="tooltipStatLine">
            <div class="tooltipStatDiff" style:color={`var(--color-${statVal < gear.slot.currentGear.stats.get(statKey)! ? "combat" : "alchemy"}-4)`}>
                {#if gear.slot.currentGear.stats.get(statKey) != statVal}
                <p class="diffSign">{(statVal - gear.slot.currentGear.stats.get(statKey)!) > 0 ? "+" : "−"}</p>
                <p class="diffMagnitude">{(Math.abs(statVal - gear.slot.currentGear.stats.get(statKey)!) * (statKey.includes("oxic") || statKey.includes("rmor") ? 1 : 100)).toFixed(0)}</p>
                {/if}
            </div>

            <div class="tooltipStatBase">
                <p class="tooltipStatValue">{(statKey.includes("oxic") || statKey.includes("rmor") ? statVal : 100 * statVal).toFixed(0)}</p>
                <p class="tooltipStatUnit">{statKey.includes("oxic") || statKey.includes("rmor") ? "pts" : "%"}</p>
                <p class="tooltipStatName">{statKey}</p>
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

        &:hover {
            background-image: linear-gradient(to bottom, transparent, var(--color-grey-0));

            .slotLabel {
                background: linear-gradient(in oklab to bottom, transparent, var(--color-grey-0), transparent);
            }
        }
    }

    img {
        width: 64px;
        height: 128px;
    }

    .texts {
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
        
    .gearNickname,
    .slotLabel {
        text-align: center;
        width: 100%;
        height: 1.4lh;
        align-content: center;
        color: white;
    }

    .gearNickname {
        background: linear-gradient(in oklab to bottom, oklab(from var(--color-grey-2) l a b / 50%), transparent);
        font-family: var(--h-font);
        font-weight: 700;
        font-size: var(--h4-size);
    }
    
    .slotLabel {
        background: linear-gradient(in oklab to bottom, transparent, var(--color-grey-1), transparent);
        font-family: var(--h-font);
        font-weight: 700;
        font-size: var(--h4-size);
    }

    .gearStatsTooltip {
        &:popover-open {
            display: flex;
        }

        flex-flow: column nowrap;
        gap: 0.5em 0em;
    }

    .gearStatsTooltipName {
        color: var(--color-key-6);
        font-weight: 600;
    }

    .gearStatsTooltipData {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, max-content));
    }

    .tooltipStatLine {
        color: var(--color-grey-9);
        grid-column: span 5;
        display: grid;
        grid-template-columns: subgrid;
        font-weight: 500;
    }

    .tooltipStatDiff {
        grid-column: span 2;
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
    .diffSign {
    }
    .diffMagnitude {
        margin-left: 0.5em;
    }
    .tooltipStatValue {
        margin-left: 1em;
    }
    .tooltipStatUnit {
        margin-left: 0.25em;
        color: var(--color-grey-4);
    }
    .tooltipStatName {
        margin-left: 1em;
    }
</style>