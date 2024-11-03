<script lang="ts">
    let {
        stats
    } : {
        stats: Map<string, number>
    } = $props();
</script>


<div class="StatsUI">
    {#each stats.entries() as [skey, sval]}
        <span>{skey}</span>
        <span>{sval}</span>
    {/each}
</div>



<style>
    .StatsUI {
        display: grid;
        grid-template-columns: auto auto;
        gap: 0.4em 2em;
        padding: 2em;
    }
</style>