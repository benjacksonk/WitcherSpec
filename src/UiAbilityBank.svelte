<script lang="ts">
    import { getContext } from "svelte";
    import { type GeraltContext } from "$lib/types.svelte";
    import UiSkillCategory from "./UiSkillCategory.svelte";
    
    const { skillState } = getContext<GeraltContext>("geralt");

    let points: number = $derived(skillState.points);
    let tab: string = $state(skillState.categories[0].id);
</script>



<div class="UiAbilityBank">
    <div class="tabs">
        <div class="framePoints">
            <h4 class="totalPoints">Points：{points}</h4>
        </div>

        {#each skillState.categories as btnCategory}
        <button
        class="tab {btnCategory.id}"
        class:activeTab={tab === btnCategory.id}
        onmousedown={(e) => {if (e.button === 0) tab = btnCategory.id}}
        disabled={tab === btnCategory.id}
        >
            <h4 class="categoryName">{btnCategory.name}</h4>
            <h4 class="categoryPoints">{btnCategory.points || 0}</h4>
        </button>
        {/each}

        <button
        class="tab mutations"
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
        <div class="frameCategory" class:hidden={tab !== category.id}>
            <UiSkillCategory bind:category={skillState.categories[i]}/>
        </div>
        {/each}
    </div>
</div>



<style>
    .UiAbilityBank {
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
        border-style: solid;
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
        border-color: transparent;
        border-width: 1px;
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
        z-index: 0;
        background: linear-gradient(in oklab to bottom, var(--color-key-8), var(--color-key-8));
        border-width: 2px 2px 0;
        border-color: var(--color-key-7);
        border-top-color: var(--color-key-7);
        color: var(--color-key-2);

        &:not(.activeTab):hover {
            background: linear-gradient(in oklab to bottom, var(--color-key-7), var(--color-key-8));
            color: var(--color-key-1);
        }

        &.activeTab {
            z-index: 2;
            background: linear-gradient(in oklab to bottom, var(--color-key-6), var(--color-key-8));
            border-width: 2px 1px 0;
            border-color: var(--color-key-6);
            border-top-color: var(--color-key-5);
            color: white;
        }
    }

    .categoryPoints {
    }

    .categoryName {
        text-align: left;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .frameTable {
        z-index: 1;
        display: grid;
    }

    .frameCategory {
        grid-row: 1;
        grid-column: 1;
        display: grid;
    }
</style>