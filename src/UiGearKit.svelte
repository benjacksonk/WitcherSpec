<script lang="ts">
	import { getContext } from "svelte";
	import Grid from './Grid.svelte';
	import GearDisplay from './GearDisplay.svelte';
	import {Gear, GearSlot, type GeraltContext} from "$lib/types.svelte";

	const { gearState } = getContext<GeraltContext>("geralt");

	let nullGearSlot: GearSlot = new GearSlot("null", []);
	let currentSlot: GearSlot = $state(nullGearSlot);


	function handleOnClickSlot(event: MouseEvent, gearSlot: GearSlot) {
		event.preventDefault();
		currentSlot = (currentSlot === gearSlot ? nullGearSlot : gearSlot);
	}

	function handleOnClickGear(event: MouseEvent, gearSlot: GearSlot, gear: Gear) {
		event.preventDefault();
		gearSlot.currentGear = gear;
	}
</script>



<div class="UiGearKit">
	{#each gearState.slots as gearSlot, i}
	<button class="slotBtn plain" onmousedown={(event) => handleOnClickSlot(event, gearSlot)}>
		<GearDisplay gear={gearSlot.currentGear} label={gearSlot.id.charAt(0).toUpperCase() + gearSlot.id.slice(1)}/>
	</button>
	{/each}
	
	<div class="popup" class:removed={currentSlot === nullGearSlot}>
		{#each currentSlot.inventory as gear, i}
		<button class="gearBtn plain" onmousedown={(event) => handleOnClickGear(event, currentSlot, gear)}>
			<GearDisplay gear={gear}/>
		</button>
		{/each}
	</div>
</div>



<style>
    .UiGearKit {
		overflow: clip;
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

    .popup {
        z-index: 1;
		width: max-content;
		height: max-content;
        position: absolute;
        top: 100%;
		left: 50%;
		translate: -50%;
        display: grid;
		grid-template-columns: repeat(6, auto);
        justify-content: center;
        background-color: var(--color-grey-1);
        outline: 1px solid white;
    }

    button.gearBtn {
		width: fit-content;
		height: fit-content;
		display: flex;
		
        border: 1px solid var(--color-grey-1);
        border-bottom: none;
    }
</style>