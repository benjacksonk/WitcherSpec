<script lang="ts">
    import { getContext } from "svelte";
    import { type GeraltContext } from "$lib/types.svelte";
    import UiSkillCategory from "./UiSkillCategory.svelte";
    
    const { skillState } = getContext<GeraltContext>("geralt");

    let points: number = $derived(skillState.points);
    let tab: string = $state(skillState.categories[0].name);
</script>



<div class="UiAbilityBank">
    <div class="tabs">
        <p class="frameTotalPoints">
            <span class="totalPointsLabel">Points:</span>
            <span class="totalPointsValue">{points}</span>
        </p>

        {#each skillState.categories as btnCategory}
        <button
        class="tab {btnCategory.name.toLowerCase()}"
        class:activeTab={tab === btnCategory.name}
        onmousedown={(e) => {if (e.button === 0) tab = btnCategory.name}}
        disabled={tab === btnCategory.name}
        >
            <span class="categoryName">{btnCategory.name}</span>
            <span class="categoryPoints">{btnCategory.points || 0}</span>
        </button>
        {/each}

        <button
        class="tab mutations"
        onmousedown={(e) => {if (e.button === 0) tab = "mutations"}}
        disabled={tab === "mutations"}
        >
            <span class="categoryName">Mutations</span>
            <span class="categoryPoints">0</span>
        </button>
    </div>

    <div class="frameTable">
        {#each skillState.categories as category, i}
        <div class="frameCategory" class:hidden={tab !== category.name}>
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
        background-color: var(--color-key-18);
    }

    .tabs {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 2px;
        margin-bottom: -2px;
        padding-top: 7px;
        padding-right: 3px;
        align-items: end;
    }

    .frameTotalPoints,
    .tab {
        border-style: solid;
        border-top-width: 2px;
        border-radius: 50% 50% 0 0;
        padding: 9px 0px 7px;

        width: 100%;
        display: grid;
        grid-template: 100% / auto max-content;
        gap: 0.5em;
        justify-content: center;
        align-items: baseline;
    }

    .frameTotalPoints {
        border-color: transparent;
        border-width: 1px;
        color: var(--color-key-1);
    }

    .tab {
        z-index: 0;
        background: linear-gradient(in oklab to bottom, var(--color-key-15), var(--color-key-17));
        border-width: 2px 2px 0;
        border-color: var(--color-key-14) var(--color-key-15);
        color: var(--color-key-2);

        &.activeTab {
            z-index: 2;
            background: linear-gradient(in oklab to bottom, var(--color-key-14), var(--color-key-16));
            border-width: 2px 2px 0;
            border-color: var(--color-key-13) var(--color-key-15);
            color: var(--color-key-0);
        }
        &:not(.activeTab) {
            padding-top: 6px;

            &:hover {
                padding-top: 9px;
                background: linear-gradient(in oklab to bottom, var(--color-key-15), var(--color-key-16));
                border-color: var(--color-key-13) var(--color-key-15);
                color: var(--color-key-1);
            }
        }
    }
    .totalPointsLabel,
    .categoryName {
        font-weight: 600;
        text-align: left;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        &:hover {
            overflow: visible;
        }
    }

    .totalPointsValue,
    .categoryPoints {
        font-family: var(--h-font);
        font-size: var(--h4-size);
        font-weight: 500;
        text-align: right;
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