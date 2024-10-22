<script lang="ts">
	import Grid from './Grid.svelte';
	import GearDisplay from './GearDisplay.svelte';
	import { Gear, GearSlot } from '$lib/types';
	
	interface Props {
		gearSlots: GearSlot[]
	}

	let { gearSlots = $bindable([]) }: Props = $props();

	let currentSlot: GearSlot = $state<GearSlot>(gearSlots[0]);
	let removePopup: boolean = $state<boolean>(true);
	
	function handleOnclickGear(event: MouseEvent, gearSlot: GearSlot, gear: Gear) {
		event.preventDefault();
		gearSlot.currentGear = gear;
	}
	function handleOnclickSlot(event: MouseEvent, gearSlot: GearSlot) {
		event.preventDefault();
		togglePopup(gearSlot);
	}

	function togglePopup(gearSlot: GearSlot) {
		if (currentSlot?.id == gearSlot.id) {
			removePopup = true;
		}
		else {
			removePopup = false;
			currentSlot = gearSlot;
		}
	}
</script>



<div class="GearSlotControlTable">
	<div class="frameGrid">
		<Grid gap="1px">
			{#each gearSlots as gearSlot, i}
				<div class="gearSlot">
					<button class="slotBtn plain" onclick={(event) => handleOnclickSlot(event, gearSlot)}>
						<GearDisplay bind:gear={gearSlots[i].currentGear} labelSlot={true}/>
					</button>
				</div>
			{/each}
		</Grid>
	</div>
	{#if currentSlot != null}
		<div class="popup" class:removed={removePopup}>
			<div class="frameGrid">
				<Grid tracks={6} vertical={true} gap={"1px 0"}>
					{#each currentSlot.inventory as gear, i}
						<button class="gearBtn plain" onclick={(event) => handleOnclickGear(event, currentSlot, currentSlot.inventory[i])}>
<!--							<GearDisplay bind:gear={currentSlot.inventory[i]}/>-->
						</button>
					{/each}
				</Grid>
			</div>
		</div>
	{/if}
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
        border: 1px solid var(--color-grey-1);
        border-bottom: none;
    }
</style>