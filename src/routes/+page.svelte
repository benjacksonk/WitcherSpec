<script lang="ts">
    import { setContext } from "svelte";
    import GearSlots from '../GearSlots.svelte';
    import { generateGearStateData } from '$lib/gearState.svelte';
    import AbilityTableUI from "../AbilityTableUI.svelte";
    import { skillState } from '$lib/skillState.svelte';
    import { Skill, SkillSlot } from "$lib/types.svelte";
    import SlotsUI from "../SlotsUI.svelte";
    import StatsUI from "../StatsUI.svelte";

    let points = $derived(skillState.points);

    let context = {
        getSkillPerId
    };
    export const ContextType = typeof context;
    setContext("geralt", context);
    
    function getSkillPerId(id: string): Skill|undefined {
        return skillState.skillPerId.get(id);
    }
</script>



<main style:color="white">
    {#await generateGearStateData() then gearState}
        <GearSlots bind:gearSlots={gearState.slots}/>
    {/await}
    <AbilityTableUI {points} bind:skillCategories={skillState.categories}/>
    <SlotsUI/> 
    <StatsUI/>
</main>



<style>
    main {
        width: 100cqw;
        height: 100cqh;
        display: flex;
        flex-flow: row wrap;
        align-content: start;
        background-color: var(--color-key-10);
        gap: 0;
    }
</style>