<script lang="ts">
import { getContext } from "svelte";
import type { GeraltContext } from "$lib/types.svelte";
import UiSkillSlot from "./UiSkillSlot.svelte";
import UiMutationSlot from "./UiMutationSlot.svelte";
import UiMutagenSlot from "./UiMutagenSlot.svelte";

const { mutagenState, mutationState } = getContext<GeraltContext>("geralt");
</script>



<div class="UiAbilityKit">
    {#each mutagenState.mutagenSlots as mutagenSlot, i}
    <div class="mutagenQuadrant"
            style:grid-area={`${i < 2 ? 1 : 2} / ${i % 2 === 0 ? 1 : 3}`}
            style:flex-flow={`${i % 2 === 0 ? "row" : "row-reverse"} nowrap`}
    >
        <UiMutagenSlot bind:mutagenSlot={mutagenState.mutagenSlots[i]}/>
        
        <div class="frameSkillSlotUIs">
            {#each mutagenState.mutagenSlots[i].skillSlots as skillSlot, j}
            <UiSkillSlot bind:skillSlot={mutagenState.mutagenSlots[i].skillSlots[j]}/>
            {/each}
        </div>
    </div>
    {/each}

    <div class="mutationColumn">
        <div class="frameMutationSlotUI">
            <UiMutationSlot bind:mutationSlot={mutationState.mutationSlot}/>
        </div>

        {#each mutationState.mutationSlot.skillSlots as skillSlot, i}
        <UiSkillSlot bind:skillSlot={mutationState.mutationSlot.skillSlots[i]}/>
        {/each}
    </div>
</div>



<style>
    .UiAbilityKit {
        width: stretch;
        height: stretch;
        display: grid;
        /* justify-content: stretch; */
        /* align-content: stretch; */
        gap: 1px 0;

        grid-template: repeat(2, 1fr) / 1fr auto 1fr;
        background-color: var(--color-key-6);

        :nth-child(2n).mutagenQuadrant {
            justify-content: start;
        }
        :nth-child(2n+1).mutagenQuadrant {
            justify-content: end;
        }
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