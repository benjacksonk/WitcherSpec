<script lang="ts">
    import { getContext } from "svelte";
    import { dropzone } from "$lib/dragAndDrop.svelte";
    import type { SkillSlot } from "$lib/types.svelte";
    import ContextType from "./routes/+page.svelte"; 

    let {
        skillSlot = $bindable()
    }: {
        skillSlot: SkillSlot
    } = $props();
    
    let categoryId = $derived(skillSlot.skill?.categoryId ?? "");
    let skillPercent = $derived(skillSlot.skill === undefined ? 0 : (100 * skillSlot.skill.points / skillSlot.skill.maxPoints));
    
    const {
        getSkillPerId
    }: ContextType = getContext("geralt");
    
    function handleClick(mouseEvent: MouseEvent) {
        if (skillSlot.skill) skillSlot.skill.points++;
    }
    
    function handleContextMenu(mouseEvent: MouseEvent) {
        mouseEvent.preventDefault();
        if (skillSlot.skill) skillSlot.skill.points--;
    }
</script>



<div class="SkillSlotUI {categoryId}"
     use:dropzone={{
         onDrop(dragEvent: DragEvent, data: String) {
             skillSlot.skill = getSkillPerId(data);
         }
     }}
>
    <div>
        <button
            onclick={handleClick}
            oncontextmenu={handleContextMenu}
            style:background-image={`linear-gradient(in oklab to right, var(--color-key-6) ${skillPercent}%, var(--color-key-8) ${skillPercent}%)`}
        >
            <img alt="" src={skillSlot.skill?.iconPath ?? ""} height="50px" width="50px">
        </button>
    </div>
</div>



<style>
    .SkillSlotUI {
        width: 50px; height: 50px;
        max-width: 100%;
        max-height: 100%;
        border: 1px solid tan;
    }

    .SkillSlotUI.droppable {
        border-color: white;
        border-width: 2px;
        background-color: tan;
    }
    .SkillSlotUI.droppable * {
        pointer-events: none;
    }


    button {
        display: flex;
        flex: 0;
        background: none;
        border: none;
        border-radius: 0;
        padding: 0;
        height: fit-content;
        width: fit-content;
    }
    img {
        object-fit: contain;
        filter: drop-shadow(0px 1px 1px var(--color-key-9));
    }
</style>