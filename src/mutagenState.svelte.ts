import { MutagenSlot } from "$lib/types.svelte";

export const mutagenState = $state(generateMutagenStateData());

function generateMutagenStateData() {
    let mutagenSlots = [
        new MutagenSlot(),
        new MutagenSlot(),
        new MutagenSlot(),
        new MutagenSlot()
    ]
    
    return {
        mutagenSlots
    }
}