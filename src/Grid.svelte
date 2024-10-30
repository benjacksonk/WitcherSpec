<script lang="ts">
	import type { Snippet } from 'svelte';
	
	let {
		children,
		flowVertically = false,
		tracks = "auto-fit",
		trackSize = "auto",
		width = "fit-content",
		gap = "0",
	}: {
		children?: Snippet;
		flowVertically?: boolean;
		tracks?: string | number;
		trackSize?: string;
		width?: string;
		gap?: string;
	} = $props();
	
	let grow: boolean = $derived(tracks != "auto-fit" && tracks != "auto-fill");
</script>



<div class="Grid" style:gap style:width
	 style:grid-auto-flow={flowVertically ? "column" : "row"}
	 style:grid-template-columns={flowVertically ? "unset" : `repeat(${tracks}, ${grow ? `minmax(${trackSize}, 1fr)` : trackSize})`}
	 style:grid-template-rows={flowVertically ? `repeat(${tracks}, ${grow ? `minmax(${trackSize}, 1fr)` : trackSize})` : "unset"}
>
	{#if children}
		{@render children()}
	{/if}
</div>



<style>
    .Grid {
        display: grid;
        grid-auto-rows: max-content;
        grid-auto-columns: max-content;
		align-items: center;
		justify-items: center;
    }
</style>