<script lang="ts">
	import { getContext } from "svelte";
	import {Gear, type GeraltContext} from "$lib/types.svelte";
    import UiGear from "./UiGear.svelte";

	const { gearState } = getContext<GeraltContext>("geralt");

	function handleOnClickGear(event: MouseEvent, gear: Gear) {
		event.preventDefault();
		gearState.slots.find(slot => slot.inventory.includes(gear))!.currentGear = gear;
	}
</script>



<div class="UiGearKit">
	{#each gearState.slots as gearSlot, i}
	<button popovertarget={`gearSelector${i}`} class="slotBtn plain">
		<UiGear gear={gearSlot.currentGear}/>
	</button>

	<div popover id={`gearSelector${i}`} class="gearSelector">
		{#each gearSlot.inventory as gear, j}
		<button class="gearBtn plain" onmousedown={(event) => handleOnClickGear(event, gear)}>
			<UiGear gear={gear}/>
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
        background-color: var(--color-grey-39);

		grid-column: 1 / -1;
		display: grid;
		grid-template: subgrid / subgrid;
		gap: 1px;
    }

    button.slotBtn {
		width: max-content;
		height: max-content;
		display: flex;
		
        border-style: solid;
		border-color: var(--color-grey-47);
		border-width: 2px;
		border-bottom-width: 0;

		&:nth-of-type(1),
		&:nth-of-type(2) {
			grid-column: span 2;
		}
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
        background-color: var(--color-grey-47);
        border: 1px solid white;

		&:popover-open {
        	display: grid;
		}
    }

    button.gearBtn {
		width: fit-content;
		height: fit-content;
		display: flex;
		
        border: 1px solid var(--color-grey-47);
        border-bottom: none;
    }
</style>