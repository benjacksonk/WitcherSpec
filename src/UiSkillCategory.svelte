<script lang="ts">
    import { SkillCategory, type SkillSubcategory } from "$lib/types.svelte";
    import UiSkillTier from "./UiSkillTier.svelte";
    
    let {
        category = $bindable()
    }: {
        category: SkillCategory
    } = $props();

    let subcategories: SkillSubcategory[] = $derived(category.subcategories ?? []);
</script>



<div class="UiSkillCategory {category.id}">
    {#if subcategories.length > 0}
        <div class="frameTier">
            <UiSkillTier subcategories={category.subcategories}/>
        </div>
    {/if}

    {#each category.tiers as tier, i}
        <div class="frameTier" class:locked={!category.tiers[i].canIncrease}>
            <UiSkillTier bind:tier={category.tiers[i]}/>
        </div>
    {/each}
</div>



<style>
    .UiSkillCategory {
        width: 100%;
        height: 100%;
        display: grid;
        grid-auto-flow: row;
        grid-auto-rows: minmax(0, 1fr);
        color: white;
        background-color: var(--color-key-9);
        border: 1px solid var(--color-key-10);
        border-top: none;
    }

    .frameTier {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template: subgrid / subgrid;
        border-top: 1px solid var(--color-key-9);
    }
    .frameTier:first-of-type { border-top-color: var(--color-key-7); }
    .frameTier:not(:first-of-type).locked { border-top-color: var(--color-key-10); }
</style>