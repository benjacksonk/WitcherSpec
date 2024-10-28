import { capitalizeFirst, toIdString } from '$lib/common.svelte';
import skillCategoriesData from "$lib/skillCategoriesData.json";
import { Skill, SkillCategory, type SkillSubcategory, SkillTier } from "$lib/types.svelte";

export const skillData = $state(generateSkillData());

function generateSkillData() {
    let categories = skillCategoriesData.map(categoryData => {        
        let id = toIdString(categoryData.name);
        let name = categoryData.name;        
        let subcategories: SkillSubcategory[] = categoryData.subcategories
            ?.map(subcategoryData => {
            let subcategoryId = toIdString(subcategoryData.name);
            return { 
                id: subcategoryId,
                name: subcategoryData.name,
                iconPath: `/images/abilities/skills/${id}/${subcategoryId}.png`
            }
        }) ?? [];

        let skillDataArray = categoryData.skills ?? categoryData.subcategories.flatMap(({skills}) => skills);
        let tier1skillDataArray = skillDataArray.filter(({tierIndex}) => tierIndex === 0);
        let tier2skillDataArray = skillDataArray.filter(({tierIndex}) => tierIndex === 1);
        let tier3skillDataArray = skillDataArray.filter(({tierIndex}) => tierIndex === 2);
        let tier4skillDataArray = skillDataArray.filter(({tierIndex}) => tierIndex === 3);
        let tierSkillDataArrays = [tier1skillDataArray, tier2skillDataArray, tier3skillDataArray, tier4skillDataArray];

        let tiers: SkillTier[] = [];
        for (let i: number = 0; i < tierSkillDataArrays.length; i++) {
            let tierSkills = 
                tierSkillDataArrays[i].map((skillData, j) => {
                    return j < subcategories.length ?
                        new Skill(skillData.name, skillData.maxPoints, skillData.description, id, subcategories[j]) :
                        new Skill(skillData.name, skillData.maxPoints, skillData.description, id);
                });

            tiers.push(id === "general" ? new SkillTier(tierSkills) : new SkillTier(tierSkills, tiers));
        }
        if (id !== "general") {
            tiers.forEach((tier, i) => {
                tier.tiersAfter = tiers.slice(1 + i);
            });
        }
        
        return new SkillCategory(name, tiers, subcategories);
    });
    
    return {
        categories: categories,
        skillPerId: new Map(categories.flatMap(
            category => category.tiers.flatMap(
                tier => tier.skills.map(
                    skill => [skill.id, skill]
                )
            )
        )),
        get points() {
            return this.categories.map(({points}) => points).reduce((a, b) => a + b, 0);
        },
    }
}