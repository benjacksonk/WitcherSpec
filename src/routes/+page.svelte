<script lang="ts">
    import { setContext } from "svelte";
    import GearSlots from '../GearSlots.svelte';
    import { gearData } from '$lib/gearState.svelte';
    import AbilityTableUI from "../AbilityTableUI.svelte";
    import { skillData } from '$lib/skillState.svelte';
    import {Skill, SkillSlot} from "$lib/types.svelte";
    import SkillSlotUI from "../SkillSlotUI.svelte";
    
    let points = $derived(skillData.points);
    
    let testSkillSlot = $state(new SkillSlot(['combat', 'signs', 'alchemy', 'general']));

    let context = {
        getSkillPerId
    };
    export const ContextType = typeof context;
    setContext("geralt", context);
    
    function getSkillPerId(id: string): Skill|undefined {
        return skillData.skillPerId.get(id);
    }
</script>



<main>
<!--    <GearSlots bind:gearSlots={gearData.slots}/>-->
    <AbilityTableUI {points} bind:skillCategories={skillData.categories}/>
    <SkillSlotUI bind:skillSlot={testSkillSlot}/>
</main>



<style>
    main {
        width: 100cqw;
        height: 100cqh;
        display: flex;
        flex-flow: row wrap;
        align-content: start;
        background-color: var(--color-key-10);
    }
</style>