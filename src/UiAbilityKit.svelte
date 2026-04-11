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
    <div class="mutagenQuadrant">
        <div class="frameMutagenSlot">
            <UiMutagenSlot bind:mutagenSlot={mutagenState.mutagenSlots[i]}/>
        </div>
        
        <div class="frameSkillSlotUIs">
            {#each mutagenState.mutagenSlots[i].skillSlots as skillSlot, j}
            <UiSkillSlot bind:skillSlot={mutagenState.mutagenSlots[i].skillSlots[j]}/>
            {/each}
        </div>
    </div>
    {/each}

    <div class="mutationColumn">
        <div class="frameMutationColumnSlots">
            <div class="frameUiMutationSlot">
                <UiMutationSlot bind:mutationSlot={mutationState.mutationSlot}/>
            </div>

            {#each mutationState.mutationSlot.skillSlots as skillSlot, i}
            <UiSkillSlot bind:skillSlot={mutationState.mutationSlot.skillSlots[i]}/>
            {/each}
        </div>
    </div>
</div>



<style>
    .UiAbilityKit {
        width: stretch;
        height: stretch;
        display: grid;
        /* align-items: end; */
        /* align-content: stretch; */
        gap: 1px 0;

        grid-template: 1fr repeat(2, max-content) 1fr / 1fr auto 1fr;
        background-color: var(--color-key-10);

        :nth-child(2n).mutagenQuadrant {
            justify-content: start;

            .frameSkillSlotUIs {
                grid-column: 1;
            }
        }
        :nth-child(n+3).mutagenQuadrant {
            align-items: start;

            > * {
                grid-row: 1;
            }
        }
    }

    .mutagenQuadrant {
        grid-row: span 2;
        display: grid;
        grid-template: subgrid / repeat(2, minmax(0, max-content));
        gap: 0 30px;
        justify-content: end;
        align-items: end;
        
        > * {
            grid-row: 2;
        }
    }
    
    .mutagenQuadrant,
    .mutationColumn {
        background-color: var(--color-key-4);
        padding: 21px 0;
    }
    
    .frameSkillSlotUIs {
        grid-column: 2;
        height: max-content;
        display: flex;
        flex-flow: column nowrap;
        gap: 13px;
    }

    .frameMutagenSlot {
        display: grid;
        grid-template: subgrid / subgrid;
    }
    
    .frameUiMutationSlot {
        display: flex;
        grid-row: 3;
    }
    
    .mutationColumn {
        grid-row: 1 / -1;
        grid-column: 2;
        display: grid;
        grid-template: subgrid / subgrid;
        padding: 0 20px;
    }

    .frameMutationColumnSlots {
        grid-row: 2 / span 2;
        display: grid;
        grid-template-columns: subgrid;
        justify-items: center;
        align-content: space-evenly;
    }
</style>