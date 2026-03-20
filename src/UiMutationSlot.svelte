<script lang="ts">
    import type { Mutation, MutationSlot } from "$lib/types.svelte";
    
    let {
        mutationSlot = $bindable()
    } : {
        mutationSlot: MutationSlot
    } = $props();

    function handleOnClickMutation(event: MouseEvent, mutation: Mutation) {
        event.preventDefault();
        mutationSlot.mutation = mutation;
    }
</script>



<div class="UiMutationSlot">
    <button class="slotBtn plain" popovertarget="mutationSelector"
        class:combat={mutationSlot.mutation?.categoryIds.includes("combat") ?? false}
        class:signs={mutationSlot.mutation?.categoryIds.includes("signs") ?? false}
        class:alchemy={mutationSlot.mutation?.categoryIds.includes("alchemy") ?? false}
        class:general={mutationSlot.mutation?.categoryIds.includes("general") ?? false}
    >
        <img class="mutationIcon" alt="" src={mutationSlot.mutation === undefined ? "" : mutationSlot.mutation.iconPath} height="64px" width="64px">
    </button>
    
    <div id="mutationSelector" popover>
        {#each mutationSlot.inventory as mutation, i}
        <button
            class="mutationBtn plain"
            class:combat={mutation.categoryIds.includes("combat")}
            class:signs={mutation.categoryIds.includes("signs")}
            class:alchemy={mutation.categoryIds.includes("alchemy")}
            class:general={mutation.categoryIds.includes("general")}
            onmousedown={(event) => handleOnClickMutation(event, mutation)}
        >
            <img class="mutationIcon" alt="" src={mutation.iconPath} height="50px" width="50px">
            <span class="mutationName shadowText">{mutation.name}</span>
        </button>
        {/each}
    </div>
</div>



<style>
    .UiMutationSlot {
        height: max-content;
        position: relative;
    }

    button.slotBtn {
        aspect-ratio: 1;
        width: 90px;
        border-radius: 50%;

        justify-content: center;
        align-items: center;
        background-color: var(--color-key-7);
        border: 2px solid var(--color-key-5);
    }

    #mutationSelector {
        /* z-index: 1; */
        width: max-content;
        /* height: 100px; */
        position-anchor: --mutation-slot-btn;
        position: absolute;
        top: anchor(100%);
        left: anchor(50%);
        translate: -50% 0;
        background-color: var(--color-grey-10);
        border: 1px solid white;
        grid-template-columns: repeat(4, minmax(0, 100px));
        gap: 1px;
        /* justify-content: stretch;
        justify-items: stretch;
        align-content: stretch;
        align-items: stretch; */

        &:popover-open {
            display: grid;
        }
    }

    button.mutationBtn {
        width: stretch;
        height: stretch;
        display: grid;
        grid-auto-flow: row;
        justify-items: center;

        background-color: var(--color-key-8);
        padding: 0.5em;
    }

    .slotBtn img.mutationIcon {
        anchor-name: --mutation-slot-btn;
    }
    
    .mutationName {
        width: min-content;
        color: var(--color-key-1);
    }
</style>