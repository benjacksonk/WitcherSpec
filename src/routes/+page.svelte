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



<style lang="scss">
    $lr-vertex: sqrt(1 / 2); // [0-1] lightness (relative to white) where chromas are max
    $lr-min: 0;
    $lr-max: 1;
    $lr-range: $lr-max - $lr-min;
    $lr-vertex-subdivision: calc(33 / 52); // coordinated with a chroma apex at lr-subdivision-32
    @function calculate-lr($lr-subdivision) {
        $lr-p: log(($lr-vertex - $lr-min) / $lr-range, $lr-vertex-subdivision);
        @return calc($lr-min + ($lr-range * pow($lr-subdivision, $lr-p)));
    }

    $l-k1: 0.206;
    $l-k2: 0.03;
    $l-k3: calc((1 + $l-k1) / (1 + $l-k2));
    @function lr-to-l($lr) {
        $l: calc(($lr * ($lr + $l-k1)) / ($l-k3 * ($lr + $l-k2)));
        @return $l;
    }
    
    $chroma-max: 0.147;                      // [0-1] max chroma safe within all hues of chosen palette
    $anchor-lr: calculate-lr(calc(11 / 52)); // [0-1] anchor point color's lightness (relative to white)
    $anchor-cr: 0.52;                        // [0-1] anchor point color's max chroma at $anchor-lr (relative to $chroma-max)
    $chroma-b: log($anchor-cr, $anchor-lr / $lr-vertex);
    @function calculate-chroma-limit($lr) {
        $isBright: $lr-vertex > $lr;
        $c-ratio: if(
            sass($isBright): pow($lr / $lr-vertex, $chroma-b);
            else: sqrt(abs(((1 - $lr) / (1 - $lr-vertex)) * (1 - pow(abs(($lr - $lr-vertex) / (1 - $lr-vertex)), $chroma-b))));
        );
        $chroma-limit: $chroma-max * $c-ratio;
        @return $chroma-limit;
    }

    @function calculate-color($lr-subdivision, $saturation-mult, $hue) {
        $lr: calculate-lr($lr-subdivision);
        $lightness: lr-to-l($lr);
        $chroma: calculate-chroma-limit($lr) * $saturation-mult;
        @return oklch($lightness $chroma $hue);
    }

    @mixin create-spectrum($name, $hue, $saturation-mult, $subdivisions) {
        @for $i from 1 through $subdivisions {
            --color-#{$name}-#{$i - 1}: #{calculate-color(calc($i / ($subdivisions + 1)), $saturation-mult, $hue)};
        }
    }

    $l-divisions: 51;
    :global(body) {
        @include create-spectrum("grey", 0, 0, $l-divisions);
        @include create-spectrum("silver", 230.8125, 1, $l-divisions);
        @include create-spectrum("steel", 50.8125, 1, $l-divisions);
        @include create-spectrum("combat", 23, 1, $l-divisions);
        @include create-spectrum("signs", 245.5, 1, $l-divisions);
        @include create-spectrum("alchemy", 134.25, 1, $l-divisions);
        @include create-spectrum("general", 78.625, 1, $l-divisions);
        @include create-spectrum("mutations", 300 /* randomly chosen; to be decided later */, 1, $l-divisions);
        
        @for $i from 0 through ($l-divisions - 1) {
            --color-key-#{$i}: var(--color-grey-#{$i});
        }
    }
	:global(.silver) {
        @for $i from 0 through ($l-divisions - 1) {
            --color-key-#{$i}: var(--color-silver-#{$i});
        }
	}
	:global(.steel) {
        @for $i from 0 through ($l-divisions - 1) {
            --color-key-#{$i}: var(--color-steel-#{$i});
        }
	}
	:global(.combat) {
        @for $i from 0 through ($l-divisions - 1) {
            --color-key-#{$i}: var(--color-combat-#{$i});
        }
    }
	:global(.signs) {
        @for $i from 0 through ($l-divisions - 1) {
            --color-key-#{$i}: var(--color-signs-#{$i});
        }
    }
	:global(.alchemy) {
        @for $i from 0 through ($l-divisions - 1) {
            --color-key-#{$i}: var(--color-alchemy-#{$i});
        }
    }
	:global(.general) {
        @for $i from 0 through ($l-divisions - 1) {
            --color-key-#{$i}: var(--color-general-#{$i});
        }
    }
	:global(.mutations) {
        @for $i from 0 through ($l-divisions - 1) {
            --color-key-#{$i}: var(--color-mutations-#{$i});
        }
    }
	:global(.alchemy.combat) {
    }
	:global(.alchemy.signs) {
    }
	:global(.combat.signs) {
    }
	:global(.combat.signs.alchemy) {
    }
	
    :global(.shadow) {
		filter: drop-shadow(0px 1px 1px var(--color-key-9));
	}
	:global(.shadowText) {
		text-shadow: 0 1px 3px var(--color-key-12);
	}
	:global(.tooltip) {
        pointer-events: none;
        width: max-content;
        position: absolute;
        top: anchor(100%);
        left: anchor(50%);
        translate: -50%;
        box-shadow: 0 2px 8px 1px var(--color-grey-4);
        color: black;
        border: 2px solid var(--color-key-48);
        border-radius: 8px;
        padding: 1em;
		overflow: visible;
		background:	linear-gradient(in oklab to bottom, white, transparent),
					linear-gradient(in oklab to right, 
						var(--color-key-50), 
						white, 
						white, 
						var(--color-key-50)
                    );

        &::before, &::after {
            content: "";
            position: absolute;
            left: 50%;
            translate: -50%;
            rotate: 45deg;
            width: 12px;
            height: 12px;
        }
        &::before {
            top: calc((-12px * (1 / 2)) - 2px);
			background-color: var(--color-key-48);
        }
        &::after {
            top: calc((-12px * (1 / 2)) + (2px * (sqrt(2) - 1)));
			background: white;
        }
	}

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