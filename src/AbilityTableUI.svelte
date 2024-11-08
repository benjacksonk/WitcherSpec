<script lang="ts">
    import { getContext } from "svelte";
    import { type GeraltContext } from "$lib/types.svelte";
    import SkillCategoryUI from "./SkillCategoryUI.svelte";
    
    const { skillState } = getContext<GeraltContext>("geralt");

    let points: number = $derived(skillState.points);
    let tab: string = $state(skillState.categories[0].id);
</script>



<div class="AbilityTables">
    <div class="tabs">
        <div class="framePoints">
            <h4 class="totalPoints">Points：{points}</h4>
        </div>
        {#each skillState.categories as btnCategory}
            <button
                class="tab {btnCategory.id}"
                style:z-index={tab === btnCategory.id ? 2 : 0}
                style:border-bottom-color={tab === btnCategory.id ? "var(--color-key-8)" : "transparent"}
                onmousedown={(e) => {if (e.button === 0) tab = btnCategory.id}}
                disabled={tab === btnCategory.id}
            >
                <h4 class="categoryName">{btnCategory.name}</h4>
                <h4 class="categoryPoints">{btnCategory.points || 0}</h4>
            </button>
        {/each}

        <button
            class="tab mutations"
            class:zIndex1={tab === "mutations"}
            style:border-bottom-color={tab === "mutations" ? "var(--color-key-8)" : "transparent"}
            onmousedown={(e) => {if (e.button === 0) tab = "mutations"}}
            disabled={tab === "mutations"}
        >
            <h4 class="categoryName">Mutations</h4>
            <h4 class="categoryPoints">0</h4>
        </button>
    </div>
    <div class="frameTable">
        {#each skillState.categories as category, i}
            <div class="frameCategory" class:removed={tab !== category.id}>
                <SkillCategoryUI bind:category={skillState.categories[i]}/>
            </div>
        {/each}
    </div>
</div>



<style>
    .AbilityTables {
        width: fit-content;
        height: fit-content;
        max-width: 100%;
        max-height: 100%;
        display: grid;
        grid-auto-flow: row;
        grid-template-rows: auto minmax(0, 1fr);
        background-color: var(--color-key-10);
    }

    .tabs {
        width: 100%;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: minmax(0, 1fr);
        gap: 4px;
        margin-bottom: -1px;
        padding-top: 7px;
    }

    .framePoints,
    .tab {
        border: 1px solid transparent;
        border-top-width: 2px;
        border-radius: 50% 50% 0 0;
        padding: 0.79cap 0.79cap 0.5cap 0.79cap;
        height: 100%;
        width: 100%;
        display: grid;
        justify-content: center;
        align-items: center;
    }

    .framePoints {
        grid-template: 100% / 100%;
    }

    .totalPoints {
        text-align: center;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--color-key-1);
    }

    .tab {
        grid-template: 100% / max-content auto;
        gap: 11px;
        background-color: var(--color-key-8);
        border-top-color: var(--color-key-7);
    }

    .categoryPoints {
        color: var(--color-key-1);
    }

    .categoryName {
        text-align: left;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--color-key-1);
    }

    .frameTable {
        z-index: 1;
        width: 100%;
        height: 100%;
        display: grid;
        grid-auto-flow: row;
        grid-auto-rows: minmax(0, 1fr);
    }

    .frameCategory {
        height: 100%;
        display: flex;
    }
    
    .zIndex1 {
        z-index: 1;
    }
</style>