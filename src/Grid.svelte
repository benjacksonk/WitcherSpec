<script lang="ts">
	import type { Snippet } from 'svelte';
	
	let {
		children,
		vertical = false,
		tracks = "auto-fit",
		trackSizeMin = "auto",
		width = "fit-content",
		justifyContent = "space-evenly",
		gap = "0",
	}: {
		children?: Snippet;
		vertical?: boolean;
		tracks?: string | number;
		trackSizeMin?: string;
		width?: string;
		justifyContent?: string;
		gap?: string;
	} = $props();
</script>



{#if vertical === true}
	<div class="Grid"
			 style:gap
			 style:width
			 style:justify-content={justifyContent}
			 style:grid-auto-flow="row"
			 style:grid-template-columns="repeat({tracks}, minmax({trackSizeMin}, 1fr))"
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else}
	<div class="Grid"
			 style:gap
			 style:width
			 style:justify-content={justifyContent}
			 style:grid-auto-flow="column"
			 style:grid-template-rows="repeat({tracks}, minmax({trackSizeMin}, 1fr))"
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}



<style>
    .Grid {
        display: grid;
        grid-auto-rows: max-content;
        grid-auto-columns: max-content;
        /*overflow: hidden;*/
        /*overflow-y: scroll;*/
    }
</style>