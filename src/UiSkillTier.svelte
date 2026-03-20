<script lang="ts">
    import { type SkillSubcategory, SkillTier } from "$lib/types.svelte";
    import UiSkillOrSubcategory from "./UiSkillOrSubcategory.svelte";

    let {
        tier = $bindable(),
        subcategories = [],
    }: {
        tier?: SkillTier,
        subcategories?: SkillSubcategory[],
    } = $props();
    
    let locked: boolean = $derived(tier?.canIncrease === false);
</script>



<div class="UiSkillTier" class:locked={locked}>
    {#if tier != null}
        {#each tier.skills as skill, i}
            <div class="frameSkillOrSubcategory">
                <UiSkillOrSubcategory bind:skill={tier.skills[i]} tierCanIncrease={tier.canIncrease} tierCanDecrease={tier.canDecrease}/>
            </div>
        {/each}
    {:else}
        {#each subcategories as subcategory, i}
            <div class="frameSkillOrSubcategory">
                <UiSkillOrSubcategory subcategory={subcategories[i]}/>
            </div>
        {/each}
    {/if}
</div>



<style>
    .UiSkillTier {
        width: 100%;
        max-height: 100%;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: minmax(0, 1fr);

        color: white;
        background-color: var(--color-key-8);
        gap: 0 7px;
        padding: 4px 7px;

        &.locked {
            background-color: var(--color-key-9);
        }
    }

    .frameSkillOrSubcategory {
        display: flex;
        overflow: hidden;
    }
</style>