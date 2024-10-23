<script lang="ts">
    import GearSlots from '../GearSlots.svelte';
    import { gearData } from '$lib/gearState.svelte.js';
</script>



<main>
    <GearSlots bind:gearSlots={gearData.slots}/>
</main>



<style>
    main {
        width: 100cqw;
        height: 100cqh;
        display: flex;
        flex-flow: row wrap;
        align-content: start;
        background-color: var(--color-key-10);
    }
</style>