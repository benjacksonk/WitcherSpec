<script lang="ts">
	import { getContext } from "svelte";
	import GearDisplay from './GearDisplay.svelte';
	import {Gear, GearSlot, type GeraltContext} from "$lib/types.svelte";

	const { gearState } = getContext<GeraltContext>("geralt");

	let currentSlot: GearSlot = $state(gearState.slots[0]);

	function handleOnClickGear(event: MouseEvent, gearSlot: GearSlot, gear: Gear) {
		event.preventDefault();
		gearSlot.currentGear = gear;
	}
</script>



<div class="UiGearKit">
	{#each gearState.slots as gearSlot, i}
	<button popovertarget={`gearSelector${i}`} class="slotBtn plain">
		<GearDisplay gear={gearSlot.currentGear} label={gearSlot.id.charAt(0).toUpperCase() + gearSlot.id.slice(1)}/>
	</button>

	<div popover id={`gearSelector${i}`} class="gearSelector">
		{#each gearSlot.inventory as gear, j}
		<button class="gearBtn plain" onmousedown={(event) => handleOnClickGear(event, currentSlot, gear)}>
			<GearDisplay gear={gear}/>
		</button>
		{/each}
	</div>
	{/each}
</div>



<style>
    .UiGearKit {
		anchor-name: --ui-gear-kit;
        width: max-content;
        /* height: max-content; */
        position: relative;
        background-color: var(--color-grey-2);

		grid-column: span 6;
		display: grid;
		grid-template: subgrid / subgrid;
    }

    button.slotBtn {
		width: max-content;
		height: max-content;
		display: flex;
		
        border-style: solid;
		border-color: var(--color-grey-1);
		border-width: 2px;
		border-bottom-width: 0;
    }

    .gearSelector {
		width: max-content;
		height: max-content;
        position: absolute;
		position-anchor: --ui-gear-kit;
        top: anchor(100%);
		left: anchor(50%);
		translate: -50%;
		grid-template-columns: repeat(6, auto);
        justify-content: center;
        background-color: var(--color-grey-1);
        border: 1px solid white;

		&:popover-open {
        	display: grid;
		}
    }

    button.gearBtn {
		width: fit-content;
		height: fit-content;
		display: flex;
		
        border: 1px solid var(--color-grey-1);
        border-bottom: none;
    }
</style>