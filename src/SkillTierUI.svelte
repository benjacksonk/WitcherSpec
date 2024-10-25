<script lang="ts">
    import SkillOrSubcategory from "./SkillOrSubcategory.svelte";
    import { type SkillSubcategory, SkillTier } from "$lib/types.svelte";

    let {
        tier = $bindable(),
        subcategories = [],
    }: {
        tier?: SkillTier,
        subcategories?: SkillSubcategory[],
    } = $props();
    
    let locked: boolean = $derived((tier?.canIncrease === false) ?? false);
</script>



<div class="SkillTier" class:locked>
    {#if tier != null}
        {#each tier.skills as skill, i}
            <div class="frameSkillOrSubcategory">
                <SkillOrSubcategory bind:skill={tier.skills[i]} tierCanIncrease={tier.canIncrease} tierCanDecrease={tier.canDecrease}/>
            </div>
        {/each}
    {:else}
        {#each subcategories as subcategory, i}
            <div class="frameSkillOrSubcategory">
                <SkillOrSubcategory subcategory={subcategories[i]}/>
            </div>
        {/each}
    {/if}
</div>



<style>
    .SkillTier {
        width: 100%;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: minmax(0, 1fr);

        color: white;
        background-color: var(--color-key-8);
        gap: 0 7px;
        padding: 4px 7px;
    }
    .SkillTier.locked {
        background-color: var(--color-key-9);
    }

    .frameSkillOrSubcategory {
        display: flex;
    }
</style>