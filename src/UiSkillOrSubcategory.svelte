<script lang="ts">
    import { draggable } from "$lib/dragAndDrop.svelte"
    import { Skill, type SkillSubcategory } from "$lib/types.svelte";

    let {
        skill = $bindable(),
        subcategory,
        tierCanIncrease = true,
        tierCanDecrease = true
    }: {
        skill?: Skill,
        subcategory?: SkillSubcategory,
        tierCanIncrease?: boolean,
        tierCanDecrease?: boolean
    } = $props();
    
    let disabled: boolean = $derived(!tierCanIncrease);
    
    function handleClick(mouseEvent: MouseEvent) {
        if (skill?.isMax === false) {
            skill.points++;
        }
    }
    
    function handleContextMenu(mouseEvent: MouseEvent) {
        mouseEvent.preventDefault();
        if (tierCanDecrease && skill?.isMin === false) {
            skill.points--;
        }
    }
</script>



<div class="SkillCell">
    {#if subcategory != null}
        <div class="frameSubcategoryHeader">
            <img alt="" src={subcategory.iconPath} class="icon subcategoryIcon"/>
            <h4 class="name subcategoryName">{subcategory.name}</h4>
        </div>
    {/if}
    {#if skill != null}
        <button
            {disabled}
            class="skill"
            class:learned={skill.points > 0}
            use:draggable={skill.id}
            onclick={handleClick}
            oncontextmenu={handleContextMenu}
            style:background-image={`linear-gradient(in oklab to right, var(--color-key-5) ${100 * skill.points / skill.maxPoints}%, transparent ${100 * skill.points / skill.maxPoints}%)`}
        >
            <img alt="" src={skill.iconPath} class="icon skillIcon"/>
            <span class="name">{skill.name}</span>
        </button>
    {/if}
</div>



<style>
    .SkillCell {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    .frameSubcategoryHeader,
    button.skill {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template: 100% / max-content auto;
        gap: 0;
        justify-content: start;
        align-items: center;
    }

    button.skill {
        background: none;
        border: 1px solid transparent;
        border-radius: 2px;
        font-family: var(--font);
        color: rgba(255 255 255 / 85%);
        padding: 0;
    }
    button.skill.learned {
        color: white;
        border-color: var(--color-key-5);
        background-color: var(--color-key-6);
    }
    button.skill:disabled {
        color: rgba(255 255 255 / 70%);
    }
    button.skill:not(.learned):enabled:hover {
        background-color: var(--color-key-7);
    }
    button.skill.learned:enabled:hover {
        border-color: var(--color-key-3);
    }


    .subcategoryName,
    .name {
        padding: 0 11px;
        text-align: left;
    }

    .subcategoryName {
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--color-key-1);
    }

    img.icon {
        width: auto;
        max-height: 100%;
        max-width: 100%;
        object-fit: scale-down;
        display: block;
        overflow: hidden;
    }

    img.icon,
    .name {
        filter: drop-shadow(0px 1px 1px var(--color-key-9));
    }
</style>