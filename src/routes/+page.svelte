<script lang="ts">
    import { setContext } from "svelte";
    import { type GeraltContext } from "$lib/types.svelte";
    import { gearState } from '$lib/gearState.svelte';
    import { skillState } from '$lib/skillState.svelte';
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



<main style:color="white">
    <UiAbilityBank/>

    <div class="frameKits">
        <UiAbilityKit/>

        <div class="gearAndStats">
            <UiGearKit/>
            <UiStats/>
        </div>
    </div>
</main>



<style>
    main {
        width: 100%;
        height: 100%;
        /* max-height: 100dvh; */
        overflow: clip auto;
        background-color: var(--color-key-10);
        display: grid;

        /* gap: 0; */
        flex-flow: column nowrap;
        /* grid-auto-flow: column; */
        grid-template-rows: max-content;
        grid-auto-rows: minmax(0, 1fr);
        align-content: stretch;
        align-items: stretch;
    }



    .frameKits {
        width: 100%;

        /* min-height: 0px; */
            /* height: 100%; */
        /* max-height: none; */
        background-color: darkslategray;

        overflow: clip visible;
        /* grid-column: 1 / -1; */
        display: flex;
        flex-flow: row wrap;
        align-items: stretch;
    }

    .gearAndStats {
        width: fit-content;
        
        background-color: #332;

        min-height: 100%;

        --size: calc-size(max-content, size);
        --fits: calc-size(fit-content, sign(size));

        /* --testSize: calc(var(--size) * 10); */

        max-height: 
        /* 100% */
        /* stretch */
        /* if(style(--fits: 0): max-content; else: 100%) */
        /* min-content */
        /* calc-size(min-content, min(size, 100%)) */
        calc-size(min-content, max(size, 100%))
        ;

        height: 
        /* 100% */
        /* min-content */
        /* fit-content */
        /* max-content */
        /* stretch */
        /* calc-size(max-content, clamp(100%, size, min(size,100%))) */
        ;

        
        overflow: clip visible;
        display: grid;

        grid-template-columns: repeat(6, max-content);
        grid-template-rows: max-content;
        grid-auto-rows: minmax(0, 1fr);
        gap: 0px 1px;
        align-content: stretch;
        align-items: stretch;
    }
</style>