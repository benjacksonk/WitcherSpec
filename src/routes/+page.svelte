<script lang="ts">
    import GearSlots from '../GearSlots.svelte';
    import { gearData } from '$lib/gearState.svelte';
    import { skillData } from '$lib/skillState.svelte';
    import AbilityTables from "../AbilityTables.svelte";
    
    let points = $derived(skillData.points);
</script>



<main>
    <GearSlots bind:gearSlots={gearData.slots}/>
    <AbilityTables {points} bind:skillCategories={skillData.categories}/>
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