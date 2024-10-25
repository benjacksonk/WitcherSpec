<script lang="ts">
	import { type Gear } from '$lib/types.svelte';
	
	let { 
		gear,
		labelSlot = false
	}: {
		gear: Gear;
		labelSlot?: boolean;
	} = $props();
</script>



<div class="GearDisplay">
	<img src={gear.iconPath} alt={gear.name} class:hidden={gear.name === "None"}/>
	<div class="name shadowText">
		<span style:font-style={"italic"}>{gear.name.includes("Leather") ? "Kaer Morhen" : gear.name.split(" ")[0]}</span>
		{#if labelSlot}
			<span>{gear.slotId.charAt(0).toUpperCase() + gear.slotId.slice(1)}</span>
		{/if}
	</div>
</div>



<style>
    .GearDisplay {
        width: 80px;
        display: grid;
        grid-auto-flow: row;
        grid-auto-rows: 100%;
        justify-content: stretch;
        justify-items: center;
        background-color: var(--color-grey-1);
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
</style>