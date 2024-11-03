<script lang="ts">
    import { setContext } from "svelte";
    import GearSlots from '../GearSlots.svelte';
    import { gearState } from '$lib/gearState.svelte';
    import AbilityTableUI from "../AbilityTableUI.svelte";
    import { skillState } from '$lib/skillState.svelte';
    import { Skill, SkillSlot } from "$lib/types.svelte";
    import SlotsUI from "../SlotsUI.svelte";
    import StatsUI from "../StatsUI.svelte";

    let points = $derived(skillState.points);
    
    let stats = $derived.by(() => {
        return gearState.slots
            .flatMap(slot => slot.currentGear?.stats ?? [])
            .reduce(
                (a, b) => {
                    b.forEach((value, key) => a.set(key, (a.get(key) ?? 0) + (b.get(key) ?? 0)))
                    return a;
                },
                new Map<string, number>()
            );
    });
    
    function getSkillPerId(id: string): Skill|undefined {
        return skillState.skillPerId.get(id);
    }
</script>



<main style:color="white">
    <GearSlots bind:gearSlots={gearState.slots}/>
<!--    <AbilityTableUI {points} bind:skillCategories={skillState.categories}/>-->
<!--    <SlotsUI/> -->
    <StatsUI {stats}/>
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