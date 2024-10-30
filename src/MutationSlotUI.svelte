<script lang="ts">
    import type { Mutation, MutationSlot } from "$lib/types.svelte";
    import Grid from "./Grid.svelte";
    
    let {
        mutationSlot = $bindable()
    } : {
        mutationSlot: MutationSlot
    } = $props();

    let removePopup: boolean = $state(true);

    function handleOnClickSlot(event: MouseEvent) {
        event.preventDefault();
        removePopup = !removePopup;
    }

    function handleOnClickMutation(event: MouseEvent, mutation: Mutation) {
        event.preventDefault();
        mutationSlot.mutation = mutation;
    }
</script>



<div class="MutationSlotUI">
    <button class="slotBtn plain" onmousedown={handleOnClickSlot}
        class:combat={mutationSlot.mutation?.categoryIds.includes("combat") ?? false}
        class:signs={mutationSlot.mutation?.categoryIds.includes("signs") ?? false}
        class:alchemy={mutationSlot.mutation?.categoryIds.includes("alchemy") ?? false}
        class:general={mutationSlot.mutation?.categoryIds.includes("general") ?? false}
    >
        <img alt="" src={mutationSlot.mutation === undefined ? "" : mutationSlot.mutation.iconPath} height="64px" width="64px">
    </button>
    <div class="popup" class:removed={removePopup}>
        <div class="frameGrid">
            <Grid tracks={4} gap={"1px"} trackSize={"50px"}>
                {#each mutationSlot.inventory as mutation, i}
                    <button
                        class="mutationBtn plain"
                        class:combat={mutation.categoryIds.includes("combat") ?? false}
                        class:signs={mutation.categoryIds.includes("signs") ?? false}
                        class:alchemy={mutation.categoryIds.includes("alchemy") ?? false}
                        class:general={mutation.categoryIds.includes("general") ?? false}
                        onmousedown={(event) => handleOnClickMutation(event, mutation)}
                    >
                        <img alt="" src={mutation.iconPath} height="50px" width="50px">
                        <span class="mutationName shadowText">{mutation.name}</span>
                    </button>
                {/each}
            </Grid>
        </div>
    </div>
</div>



<style>
    .MutationSlotUI {
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

    .popup {
        z-index: 1;
        width: max-content;
        height: max-content;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
    }

    .popup .frameGrid {
        background-color: var(--color-grey-6);
        outline: 1px solid white;
        display: flex;
        width: max-content;
    }

    button.mutationBtn {
        width: 100%;
        height: 100%;
        display: grid;
        grid-auto-flow: row;
        justify-items: center;

        background-color: var(--color-key-8);
        padding: 0.5em;
    }
    
    .mutationName {
        width: min-content;
        color: var(--color-key-1);
    }
</style>