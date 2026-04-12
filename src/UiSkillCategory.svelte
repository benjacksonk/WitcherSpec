<script lang="ts">
    import { draggable } from "$lib/dragAndDrop.svelte"
    import { Skill, SkillCategory, type SkillSubcategory } from "$lib/types.svelte";
    
    let {
        category = $bindable()
    }: {
        category: SkillCategory
    } = $props();

    let subcategories: SkillSubcategory[] = $derived(category.subcategories ?? []);
    let uid = $props.id();
    
    function handleClick(mouseEvent: MouseEvent, skill: Skill) {
        mouseEvent.preventDefault();
        if (skill.canIncrease) {
            skill.points++;
        }
    }
    
    function handleContextMenu(mouseEvent: MouseEvent, skill: Skill) {
        mouseEvent.preventDefault();
        if (skill.canDecrease) {
            skill.points--;
        }
    }
</script>



<div class="UiSkillCategory {category.name.toLowerCase()}">
    {#if subcategories.length > 0}
    <div class="subcategoryRow">
        {#each category.subcategories as subcategory, i}
        <div class="subcategoryHeader">
            <img alt="" src={subcategory.iconPath} class="icon subcategoryIcon"/>
            <h4 class="name subcategoryName">{subcategory.name.replaceAll("_", " ")}</h4>
        </div>
        {/each}
    </div>
    {/if}

    {#each category.tiers as tier, i}
    <div class="skillRow" class:locked={category.unlockedTiers < 1 + i}>
        {#each tier as skill, j}
        <button
        interestfor={`${uid}-skill-${skill.name}`}
        class="skill"
        class:locked={category.unlockedTiers < 1 + i}
        class:learned={skill.points > 0}
        use:draggable={skill.name}
        onclick={(event) => handleClick(event, skill)}
        oncontextmenu={(event) => handleContextMenu(event, skill)}
        style:--skill-progress={skill.progress}
        >
            <img alt="" src={skill.iconPath} class="icon skillIcon"/>
            <p class="name">{skill.name.replaceAll("_", " ")}</p>
        </button>

        <div popover="hint" id={`${uid}-skill-${skill.name}`} class="tooltip skillTooltip">
            <h4 class="tooltipHeader">{skill.name.replaceAll("_", " ")}</h4>
            <p>{skill.currentLevelDescription}</p>
            <p>Points: {skill.points} / {skill.levels.length - 1}</p>
        </div>
        {/each}
    </div>
    {/each}
</div>



<style>
    .UiSkillCategory {
        width: stretch;
        height: stretch;
        display: grid;
        grid-template-columns: 0 repeat(5, 1fr minmax(0, 2.618fr)) 0;
        grid-auto-rows: minmax(0, 1fr);
        gap: 0 7px;
        color: white;
        background-color: var(--color-key-17);
        border-top: 2px solid var(--color-key-14);
    }
    
    .subcategoryRow,
    .skillRow {
        grid-column: 1 / -1;
        display: grid;
        grid-template: subgrid / subgrid;
        color: white;
        background: var(--color-key-11);
        border-style: solid;
        border-width: 0 1px 1px;
        border-color: var(--color-key-9);
        padding: 4px 0;

        &:before, &:after {
            content: "";
            contain: strict;
        }
        
        &.subcategoryRow {
            background: var(--color-key-11);
            border-bottom-color: var(--color-key-14);
            box-shadow: inset 0 -2px 2px oklab(from var(--color-key-8) l a b / 50%);
        }
        &.locked {
            background: var(--color-key-7);
            border-color: var(--color-key-4);
            box-shadow: inset 0 2px 2px var(--color-key-6);

            &:has(+ .locked) {
                border-bottom-color: var(--color-key-6);
            }

            .name {
                filter: drop-shadow(0px 1px 1px var(--color-key-5));
            }
        }
    }

    img.icon {
        object-fit: scale-down;
        height: 100%;
        width: 100%;
        contain: size;
    }

    img.icon,
    .name {
        filter: drop-shadow(0px 1px 1px var(--color-key-9));
    }

    .subcategoryHeader,
    button.skill {
        grid-column: span 2;
        height: 100%;
        width: 100%;
        display: grid;
        grid-template: 100% / subgrid;
        gap: 0;
        justify-content: start;
        align-items: center;

        &:hover {
            .name {
                /* overflow: visible; */
            }
        }
    }

    button.skill {
        background: none;
        border: 1px solid transparent;
        border-radius: 6px;
        font-family: var(--font);
        font-weight: 500;
        color: var(--color-grey-46);
        padding: 0;

        &:hover {
            background: linear-gradient(in oklab to bottom, var(--color-key-13), var(--color-key-12));
            border-color: var(--color-key-15) var(--color-key-14) var(--color-key-14);
        }

        &:hover, 
        &.learned {
            color: var(--color-grey-48);
            box-shadow: 0 1px 2px 1px var(--color-key-9);
        }

        &.locked {
            color: var(--color-grey-38);

            &:hover {
                color: var(--color-grey-43);
                border-color: var(--color-key-10);
                background-image: linear-gradient(in oklab to bottom, var(--color-key-9), var(--color-key-10));
                box-shadow: none;
            }
        }

        &.learned {
            border-color: var(--color-key-20) var(--color-key-17) var(--color-key-16);
            background: linear-gradient(in oklab to right, var(--color-key-17) calc(100% * var(--skill-progress)), transparent calc(100% * var(--skill-progress))),
                        linear-gradient(in oklab to bottom, var(--color-key-15), var(--color-key-14));

            &:hover {
                color: var(--color-grey-50);
                background: linear-gradient(in oklab to right, var(--color-key-19) calc(100% * var(--skill-progress)), transparent calc(100% * var(--skill-progress))),
                            linear-gradient(in oklab to bottom, var(--color-key-16), var(--color-key-15));
            }
        }
    }

    .name {
        max-width: min-content;
        padding: 0 11px;
        text-align: left;
        text-overflow: ellipsis;
        overflow: hidden;
        text-wrap-style: balance;
        margin-left: -7px;
    }

    .subcategoryName {
        color: var(--color-key-43);
    }
    
    .skillTooltip {
        .tooltipHeader {
            margin: 0 0 0.25em 0;
            color: var(--color-key-15);
            font-weight: 600;
        }
    }
</style>