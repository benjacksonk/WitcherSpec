<script lang="ts">
    import type { Mutagen, MutagenSlot } from "$lib/types.svelte";

    let {
        mutagenSlot = $bindable()
    } : {
        mutagenSlot: MutagenSlot
    } = $props();

    const uid = $props.id();
 
    function handleOnClickMutagen(event: MouseEvent, mutagen: Mutagen) {
        event.preventDefault();
        mutagenSlot.mutagen = mutagen;
    }
</script>



<div class="UiMutagenSlot">
    <button popovertarget={`mutagenGrid-${uid}`} class="slotBtn plain"
    class:combat={mutagenSlot.mutagen?.categoryId === "combat"}
    class:signs={mutagenSlot.mutagen?.categoryId === "signs"}
    class:alchemy={mutagenSlot.mutagen?.categoryId === "alchemy"}
    class:general={mutagenSlot.mutagen?.categoryId === "general"}
    >
        <img class="mutagenIcon" alt="" src={mutagenSlot.mutagen?.iconPath ?? ""} height="64px" width="64px" style:anchor-name={`--mutagen-${uid}-icon`}/>
    </button>

    <div popover id={`mutagenGrid-${uid}`} class="mutagenGrid" style:position-anchor={`--mutagen-${uid}-icon`}>
        {#each mutagenSlot.inventory as mutagen, i}
        <button
        class="mutagenBtn plain"
        class:combat={mutagen.categoryId === "combat"}
        class:signs={mutagen.categoryId === "signs"}
        class:alchemy={mutagen.categoryId === "alchemy"}
        class:general={mutagen.categoryId === "general"}
        onmousedown={(event) => handleOnClickMutagen(event, mutagen)}
        >
            <img alt="" src={mutagen.iconPath} height="64px" width="64px">
            <span class="mutagenName shadowText">{mutagen.name}</span>
        </button>
        {/each}
    </div>
</div>



<style>
    .UiMutagenSlot {
        display: grid;
        align-content: center;
        justify-content: center;
    }

    button.slotBtn {
        aspect-ratio: 1;
        width: max-content;
        height: max-content;
        /*border-radius: 50%;*/
        transform: rotate(45deg);

        justify-content: center;
        align-items: center;
        background-color: var(--color-key-7);
        border: 2px solid var(--color-key-5);
        overflow: hidden;
    }
    
    button.slotBtn > img.mutagenIcon {
        transform: rotate(-45deg);
    }

    .mutagenGrid {
        background-color: var(--color-grey-6);
        border: 1px solid white;
        width: fit-content;
        gap: 1px;
        grid-auto-flow: row;
        grid-template-columns: repeat(3, minmax(64px, 1fr));
        grid-template-rows: unset;
        top: anchor(100%);
        left: anchor(50%);
        transform: translateX(-50%);

        &:popover-open {
            display: flex;
        }
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