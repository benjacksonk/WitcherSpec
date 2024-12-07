<script lang="ts">
import { getContext } from "svelte";
import type { GeraltContext } from "$lib/types.svelte";
import SkillSlotUI from "./SkillSlotUI.svelte";
import MutationSlotUI from "./MutationSlotUI.svelte";
import MutagenSlotUI from "./MutagenSlotUI.svelte";

const { mutagenState, mutationState } = getContext<GeraltContext>("geralt");
</script>



<div class="SlotsUI">
    {#each mutagenState.mutagenSlots as mutagenSlot, i}
        <div class="mutagenQuadrant"
             style:grid-area={`${i < 2 ? 1 : 2} / ${i % 2 === 0 ? 1 : 3}`}
             style:flex-flow={`${i % 2 === 0 ? "row" : "row-reverse"} nowrap`}
        >
            <MutagenSlotUI bind:mutagenSlot={mutagenState.mutagenSlots[i]}/>
            <div class="frameSkillSlotUIs">
                {#each mutagenState.mutagenSlots[i].skillSlots as skillSlot, j}
                    <SkillSlotUI bind:skillSlot={mutagenState.mutagenSlots[i].skillSlots[j]}/>
                {/each}
            </div>
        </div>
    {/each}
    <div class="mutationColumn">
        <div class="frameMutationSlotUI">
            <MutationSlotUI bind:mutationSlot={mutationState.mutationSlot}/>
        </div>
        {#each mutationState.mutationSlot.skillSlots as skillSlot, i}
            <SkillSlotUI bind:skillSlot={mutationState.mutationSlot.skillSlots[i]}/>
        {/each}
    </div>
</div>



<style>
    .SlotsUI {
        width: max-content;
        height: max-content;
        display: grid;
        align-items: center;
        justify-items: center;
        align-content: center;
        justify-content: center;
        gap: 1px;

        grid-template: repeat(2, 1fr) / repeat(3, auto);
        background-color: var(--color-key-6);
    }

    .mutagenQuadrant {
        display: flex;
        padding: 20px 20px;
        gap: 20px;
        align-items: center;
        justify-items: center;
    }
    
    .mutagenQuadrant,
    .mutationColumn {
        background-color: var(--color-key-8);
    }
    
    .frameSkillSlotUIs {
        display: flex;
        flex-flow: column nowrap;
        gap: 10px;
    }
    
    .frameMutationSlotUI {
        display: flex;
        grid-row: 3;
    }
    
    .mutationColumn {
        grid-area: span 2 / 2;
        height: 100%;
        display: grid;
        grid-auto-flow: row;
        justify-items: center;
        align-content: space-evenly;
        padding: 0 20px;
    }
</style>