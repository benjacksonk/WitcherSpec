<script lang="ts">
    import type { Mutagen, MutagenSlot } from "$lib/types.svelte";
    import Grid from "./Grid.svelte";

    let {
        mutagenSlot = $bindable()
    } : {
        mutagenSlot: MutagenSlot
    } = $props();

    let removePopup: boolean = $state(true);

    function handleOnClickSlot(event: MouseEvent) {
        event.preventDefault();
        removePopup = !removePopup;
    }

    function handleOnClickMutagen(event: MouseEvent, mutagen: Mutagen) {
        event.preventDefault();
        mutagenSlot.mutagen = mutagen;
    }
</script>



<div class="MutagenSlotUI">
    <button class="slotBtn plain" onmousedown={handleOnClickSlot}
        class:combat={mutagenSlot.mutagen?.categoryId === "combat" ?? false}
        class:signs={mutagenSlot.mutagen?.categoryId === "signs" ?? false}
        class:alchemy={mutagenSlot.mutagen?.categoryId === "alchemy" ?? false}
        class:general={mutagenSlot.mutagen?.categoryId === "general" ?? false}
    >
        <img alt="" src={mutagenSlot.mutagen === undefined ? "" : mutagenSlot.mutagen.iconPath} height="64px" width="64px">
    </button>
    <div class="popup" class:removed={removePopup}>
        <div class="frameGrid">
            <Grid flowVertically={false} tracks={3} trackSize={"50px"} gap={"1px"}>
                {#each mutagenSlot.inventory as mutagen, i}
                    <button
                        class="mutagenBtn plain"
                        class:combat={mutagen.categoryId === "combat"}
                        class:signs={mutagen.categoryId === "signs"}
                        class:alchemy={mutagen.categoryId === "alchemy"}
                        class:general={mutagen.categoryId === "general"}
                        onmousedown={(event) => handleOnClickMutagen(event, mutagen)}
                    >
                        <img alt="" src={mutagen.iconPath} height="50px" width="50px">
                        <span class="mutagenName shadowText">{mutagen.name}</span>
                    </button>
                {/each}
            </Grid>
        </div>
    </div>
</div>



<style>
    .MutagenSlotUI {
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

    button.mutagenBtn {
        width: 100%;
        height: 100%;
        display: grid;
        grid-auto-flow: row;
        justify-items: center;

        background-color: var(--color-key-8);
        padding: 0.5em;
    }

    .mutagenName {
        width: min-content;
        color: var(--color-key-1);
    }
</style>