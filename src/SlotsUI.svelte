<script lang="ts">
import { mutationState } from "$lib/mutationState.svelte";
import SkillSlotUI from "./SkillSlotUI.svelte";
import MutationSlotUI from "./MutationSlotUI.svelte";
import Grid from "./Grid.svelte";
</script>



<div class="SlotsUI">
    <Grid tracks="5" flowVertically={true}>
        <div class="frameMutationSlotUI">
            <MutationSlotUI bind:mutationSlot={mutationState.mutationSlot}/>
        </div>
        {#each mutationState.mutationSlot.skillSlots as skillSlot, i}
            <div class="frameSkillSlotUI">
                <SkillSlotUI bind:skillSlot={mutationState.mutationSlot.skillSlots[i]}/>
            </div>
        {/each}
    </Grid>
</div>



<style>
    .SlotsUI {
        width: max-content;
        height: max-content;
        display: flex;
    }
    
    .frameMutationSlotUI {
        grid-row: 3;
        grid-column: 1;
    }
    
    .frameSkillSlotUI {
        display: flex;
    }
    .frameSkillSlotUI:nth-of-type([n]) {
        grid-row: n;
    }
</style>