import { allStatEntitySpecs } from '$lib/common.svelte';
import { Skill, SkillCategory, type StatEntitySpec } from "$lib/types.svelte";

export const skillState = $state(generateSkillStateData(allStatEntitySpecs));

function generateSkillStateData(statEntitySpecs: StatEntitySpec[]) {
	let skillCategorySpecs = statEntitySpecs.filter(spec => spec.kind.toLowerCase() === "skills");

	let categories = skillCategorySpecs.map(categorySpec => {
		let subcategorySpecs = statEntitySpecs.filter(spec => spec.kind === categorySpec.name);
		
		let skillAndUpgradeSpecs = statEntitySpecs.filter(spec => 
			subcategorySpecs.map(subcategorySpec => subcategorySpec.name).includes(spec.kind)
		).map((skillSpec): [StatEntitySpec, StatEntitySpec[]] => [
			skillSpec,
			statEntitySpecs.filter(upgradeSpec => upgradeSpec.kind === skillSpec.name)
		]);

		return new SkillCategory(categorySpec, skillAndUpgradeSpecs, subcategorySpecs);
	});

    return {
        categories: categories,
        skillPerName: new Map<string, Skill>(categories.flatMap(category => category.skills.map(skill => [skill.name, skill]))),
		
        get points() {
            return this.categories.map(category => category.points).reduce((a, b) => a + b, 0);
        },
    }
}
