<script lang="ts">
    import { setContext } from "svelte";
    import { type GeraltContext } from "$lib/types.svelte";
    import { gearState } from '$lib/gearState.svelte';
    import { skillState } from '$lib/skillState.svelte';
    import { mutagenState } from "../mutagenState.svelte";
    import { mutationState } from "$lib/mutationState.svelte";
    import AbilityTableUI from "../AbilityTableUI.svelte";
    import GearSlotsUI from '../GearSlotsUI.svelte';
    import SlotsUI from "../SlotsUI.svelte";
    import StatsUI from "../StatsUI.svelte";
    
    setContext<GeraltContext>("geralt", {
        gearState,
        mutagenState,
        mutationState,
        skillState,
    });
</script>



<main style:color="white">
    <GearSlotsUI/>
    <div class="statsAndSlotsRow">
        <StatsUI/>
        <SlotsUI/>
    </div>
    <AbilityTableUI/>
</main>



<style>
    main {
        width: 100%;
        height: 100cqh;
        display: grid;
        grid-template: max-content repeat(2, 1fr) / max-content;
        justify-content: center;
        background-color: var(--color-key-10);
        gap: 0;
    }
    
    .statsAndSlotsRow {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(2, auto);
    }
</style>