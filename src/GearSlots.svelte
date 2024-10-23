<script lang="ts">
	import Grid from './Grid.svelte';
	import GearDisplay from './GearDisplay.svelte';
	import { type Gear, GearSlot } from "$lib/types.svelte";

	interface Props {
		gearSlots: GearSlot[];
	}

	let {
		gearSlots = $bindable([]),
	}: Props = $props();

	let nullGearSlot: GearSlot = new GearSlot("null");
	let currentSlot: GearSlot = $state(nullGearSlot);
	
	
	function handleOnclickSlot(event: MouseEvent, gearSlot: GearSlot) {
		event.preventDefault();
		currentSlot = (currentSlot === gearSlot ? nullGearSlot : gearSlot);
	}
	
	function handleOnclickGear(event: MouseEvent, gearSlot: GearSlot, gear: Gear) {
		event.preventDefault();
		gearSlot.currentGear = gear;
	}
</script>



<div class="GearSlotControlTable">
	<div class="frameGrid">
		<Grid gap="1px">
			{#each gearSlots as gearSlot, i}
				<button class="slotBtn plain" onmousedown={(event) => handleOnclickSlot(event, gearSlot)}>
					<GearDisplay gear={gearSlot.currentGear} labelSlot={true}/>
				</button>
			{/each}
		</Grid>
	</div>
	<div class="popup" class:removed={currentSlot === nullGearSlot}>
		<div class="frameGrid">
			<Grid tracks={6} vertical={true} gap={"1px 0"}>
				{#each currentSlot.inventory as gear, i}
					<button class="gearBtn plain" onmousedown={(event) => handleOnclickGear(event, currentSlot, gear)}>
						<GearDisplay gear={gear}/>
					</button>
				{/each}
			</Grid>
		</div>
	</div>
</div>



<style>
    .GearSlotControlTable {
        width: max-content;
        height: max-content;
        position: relative;
        background-color: var(--color-grey-2);
    }

    .frameGrid {
        display: flex;
    }

    button.slotBtn {
		width: fit-content;
		height: fit-content;
		display: flex;
		
        border-style: solid;
		border-color: var(--color-grey-1);
		border-width: 2px;
		border-bottom-width: 0;
    }

    .popup {
        z-index: 1;
        width: 100%;
        position: absolute;
        top: 100%;
        display: flex;
        justify-content: center;
    }

    .popup .frameGrid {
        background-color: var(--color-grey-1);
        outline: 1px solid white;
        display: flex;
        width: max-content;
    }

    button.gearBtn {
		width: fit-content;
		height: fit-content;
		display: flex;
		
        border: 1px solid var(--color-grey-1);
        border-bottom: none;
    }
</style>