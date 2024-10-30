import { Mutation, MutationSlot } from "$lib/types.svelte";
import mutationDataArray from "$lib/mutationData.json"
import { toIdString } from "$lib/common.svelte";

export const mutationState = $state(generateMutationSlot());

function generateMutationSlot() {
    let mutations = mutationDataArray.map(mutationData => {
        return new Mutation(
            mutationData.name, 
            mutationData.points, 
            mutationData.categoryIds,
            mutationData.description,
            mutationData.prerequisiteNames.map(prerequisiteName => toIdString(prerequisiteName))
        );
    })
    
    return {
        mutationSlot: new MutationSlot(mutations)
    };
}