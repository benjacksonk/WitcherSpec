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
    <AbilityTableUI/>
    <SlotsUI/> 
    <StatsUI/>
</main>



<style>
    main {
        width: 100cqw;
        height: 100cqh;
        display: flex;
        flex-flow: column nowrap;
        align-content: start;
        background-color: var(--color-key-10);
        gap: 0;
    }
</style>