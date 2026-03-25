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
    
    function handleClick(mouseEvent: MouseEvent, skill: Skill, tierCanIncrease: boolean) {
        mouseEvent.preventDefault();
        if (tierCanIncrease && skill.isMax === false) {
            skill.points++;
        }
    }
    
    function handleContextMenu(mouseEvent: MouseEvent, skill: Skill, tierCanDecrease: boolean) {
        mouseEvent.preventDefault();
        if (tierCanDecrease && skill.isMin === false) {
            skill.points--;
        }
    }
</script>



<div class="UiSkillCategory {category.id}">
    {#if subcategories.length > 0}
    <div class="skillRow">
        {#each category.subcategories as subcategory, i}
        <div class="subcategoryHeader">
            <img alt="" src={subcategory.iconPath} class="icon subcategoryIcon"/>
            <h4 class="name subcategoryName">{subcategory.name}</h4>
        </div>
        {/each}
    </div>
    {/if}

    {#each category.tiers as tier, i}
    <div class="skillRow" class:locked={tier.canIncrease === false}>
        {#each tier.skills as skill, j}
        <button
        interestfor={`${uid}-skill-${skill.id}`}
        class="skill"
        class:locked={tier.canIncrease === false}
        class:learned={skill.points > 0}
        use:draggable={skill.id}
        onclick={(event) => handleClick(event, skill, tier.canIncrease)}
        oncontextmenu={(event) => handleContextMenu(event, skill, tier.canDecrease)}
        style:--skill-progress={skill.points / skill.maxPoints}
        >
            <img alt="" src={skill.iconPath} class="icon skillIcon"/>
            <p class="name">{skill.name}</p>
        </button>

        <div popover="hint" id={`${uid}-skill-${skill.id}`} class="tooltip skillTooltip">
            <h4>{skill.name}</h4>
            <p>{skill.description}</p>
            <p>Points: {skill.points} / {skill.maxPoints}</p>
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
        grid-template-columns: repeat(5, 1fr minmax(0, 2.618fr));
        grid-auto-rows: minmax(0, 1fr);
        gap: 0 7px;
        color: white;
        background-color: var(--color-key-9);
        /* border: 1px solid var(--color-key-11); */
        border-top: none;
    }
    
    .skillRow {
        grid-column: 1 / -1;
        display: grid;
        grid-template: subgrid / subgrid;
        color: white;
        background-color: var(--color-key-8);
        border-style: solid;
        border-width: 0 1px 1px;
        border-color: var(--color-key-9);
        padding: 4px 7px;
        
        &:first-child {
            border-top: 1px solid var(--color-key-6);
            background-color: var(--color-key-8);
        }

        &:not(.locked):has(+ .locked) {
            border-bottom-color: transparent;
        }

        &.locked {
            background-color: var(--color-key-10);
            border-color: var(--color-key-11);
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
            .subcategoryName,
            .name {
                overflow: visible;
            }
        }
    }

    button.skill {
        background: none;
        border-width: 1px;
        border-style: solid;
        border-color: transparent;
        border-radius: 2px;
        font-family: var(--font);
        font-weight: 500;
        color: var(--color-grey-1);
        padding: 0;

        &:hover {
            background-image: linear-gradient(in oklab to bottom, var(--color-key-6), var(--color-key-7));
            border-top-color: var(--color-key-5);
        }

        &.locked {
            color: var(--color-grey-3);

            &:hover {
                color: var(--color-grey-2);
                background-image: linear-gradient(in oklab to bottom, var(--color-key-8), var(--color-key-9));
                border-top-color: var(--color-key-8);
            }
        }

        &.learned {
            color: var(--color-grey-0);
            border-color: var(--color-key-5);
            background-color: var(--color-key-6);
            background-image: linear-gradient(in oklab to right, var(--color-key-5) calc(100% * var(--skill-progress)), transparent calc(100% * var(--skill-progress))),
                              linear-gradient(in oklab to bottom, var(--color-key-6), var(--color-key-7))
            ;

            &:hover {
                color: white;
                border-color: var(--color-key-3);
            }
        }
    }

    .name {
        padding: 0 11px;
        text-align: left;
        text-overflow: ellipsis;
        overflow: hidden;
        text-wrap-style: balance;
        margin-left: -7px;
    }

    .subcategoryName {
        text-wrap: nowrap;
        color: var(--color-key-1);
        font-weight: 600;
    }
    
    .skillTooltip {
        h4 {
            margin: 0 0 0.25em 0;
            color: var(--color-key-6);
            font-weight: 600;
        }
    }
</style>