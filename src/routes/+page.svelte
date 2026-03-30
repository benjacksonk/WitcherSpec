<script lang="ts">
    import { setContext } from "svelte";
    import { type GeraltContext } from "$lib/types.svelte";
    import { gearState } from '$lib/gearState.svelte';
    import { skillState } from "$lib/skillState.svelte";
    import { mutagenState } from "../mutagenState.svelte";
    import { mutationState } from "$lib/mutationState.svelte";
    import UiAbilityBank from "../UiAbilityBank.svelte";
    import UiGearKit from '../UiGearKit.svelte';
    import UiAbilityKit from "../UiAbilityKit.svelte";
    import UiStats from "../UiStats.svelte";
    
    setContext<GeraltContext>("geralt", {
        gearState,
        mutagenState,
        mutationState,
        skillState,
    });
</script>



<main>
    <div class="frameKits">
        <UiAbilityBank/>
        <UiAbilityKit/>
    </div>

    <div class="gearAndStats">
        <UiGearKit/>
        <div class="statsWrapper">
            <UiStats/>
        </div>
    </div>
</main>



<style>
    main {
        /*overflow: hidden; /* Initially hide parent overflow to allow the second child to handle scrolling */
        overflow-y: hidden;
        height: 100dvh; /* Set a height for the parent to define the available space */
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(0, max-content));

        flex-flow: row wrap;
        /* align-content: center; */
        justify-content: center;
        background-color: black;
    }

    .frameKits {
        background-color: teal;
        overflow-y: auto;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        /* align-content: stretch; */
        /* align-items: stretch; */
        /* justify-content: stretch; */
        /* justify-items: stretch; */
    }

    .gearAndStats {
        display: grid;
        grid-template-columns: repeat(8, max-content);
        grid-template-rows: max-content;
        grid-auto-rows: minmax(0, 1fr);
        /* gap: 0px 1px; */
        /* align-content: stretch; */
        /* align-items: stretch; */
        /* justify-content: stretch; */
        /* justify-items: stretch; */
    }

    .statsWrapper {
        grid-column: 1 / -1;
        overflow-y: auto;
        display: grid;
        grid-template-columns: subgrid;
    }
</style>