import { capitalizeFirst, toIdString } from '$lib/common.svelte';

export type Gear = {
	id: string,
	name: string,
	iconPath: string,
	slotId: string
};

export class GearSlot {
	id: string = $state("");
	name: string = $state("");
	currentGear: Gear = $state({
		id: `none`,
		name: "None",
		iconPath: "",
		slotId: ""
	});
	inventory: Gear[] = $state([]);
	
	constructor(id: string, inventory: Gear[] = []) {
		this.id = id;
		this.name = capitalizeFirst(id);
		this.currentGear = { 
			id: `${id}-none`, 
			name: "None", 
			iconPath: "", 
			slotId: id 
		};
		this.inventory = [this.currentGear, ...inventory];
	}
	
	add(gear: Gear): boolean {
		if (this.inventory.some(({id}) => id === gear.id)) {
			return false;
		}
		this.inventory.push(gear);
		return true;
	}
	
	remove(gear: Gear): boolean {
		if (!this.inventory.some(({id}) => id === gear.id)) {
			return false;
		}
		this.inventory = this.inventory.filter(({id}) => id !== gear.id);
		return true;
	}
}

export class Skill {
	id: string = $state("");
	name: string = $state("");
	categoryId: string = $state("");
	iconPath: string = $state("");
	maxPoints: number = $state(0);
	description: string = $state("");

	_points: number = $state(0);

	constructor(name: string, maxPoints: number, description: string, categoryId: string, subcategory?: SkillSubcategory) {
		let skillId = toIdString(name);
		this.id = skillId;
		this.name = name;
		this.categoryId = categoryId;
		this.iconPath = 
			`/images/abilities/skills/
			${categoryId}/
			${subcategory != null ? `${subcategory.id}/` : ""}
			${skillId}.png`;
		this.maxPoints = maxPoints;
		this.description = description;
	}
	get points(): number {
		return this._points;
	}
	
	set points(val: number) {
		this._points = Math.max(0, Math.min(val, this.maxPoints));
	}

	get isMax(): boolean {
		return this.points >= this.maxPoints;
	}

	get isMin(): boolean {
		return this.points <= 0;
	}
}

export class SkillTier {
	skills: Skill[] = $state([]);
	prerequisitePoints: number = $state(0);
	prerequisiteTiers: SkillTier[] = $state([]);
	tiersAfter: SkillTier[] = $state([]);
	
	constructor(skills: Skill[], prerequisiteTiers: SkillTier[] = []) {
		this.skills = skills;
		this.prerequisiteTiers = prerequisiteTiers;
		this.prerequisitePoints = 6 * prerequisiteTiers.length;
	}
	
	get points() {
		return this.skills.map(({points}) => points).reduce((a, b) => a + b, 0);
	}

	get pointsBefore(): number {
		return this.prerequisiteTiers.map(({points}) => points).reduce((a, b) => a + b, 0);
	}
	
	get canIncrease(): boolean {
		return this.pointsBefore >= this.prerequisitePoints;
	}
	
	get canDecrease(): boolean {
		return !this.tiersAfter.some(otherTier =>
			otherTier.points > 0
			&& otherTier.pointsBefore - 1 < otherTier.prerequisitePoints
		);
	}
}

export type SkillSubcategory = {
	id: string,
	name: string,
	iconPath: string, 
}

export class SkillCategory {
	id: string = $state("");
	name: string = $state("");
	tiers: SkillTier[] = $state([]);
	subcategories: SkillSubcategory[] = $state([]);
	
	constructor(name: string, tiers: SkillTier[], subcategories: SkillSubcategory[] = []) {
		this.id = toIdString(name);
		this.name = name;
		this.tiers = tiers;
		this.subcategories = subcategories;
	}
	
	get points(): number {
		return this.tiers.map(({points}) => points).reduce((a, b) => a + b, 0);
	}
}

export class SkillSlot {
	#categoryIds: string[] = $state([]);
	#skill?: Skill = $state();
	
	constructor(categoryIds: string[] = ["combat","signs","alchemy","general"]) {
		this.categoryIds = categoryIds;
	}
	
	get skill(): Skill|undefined {
		return this.#skill;
	}
	
	set skill(skill: Skill|undefined) {
		if (skill === undefined || this.categoryIds.includes(skill.categoryId)) {
			this.#skill = skill;
		}
	}
	
	get categoryIds(): string[] {
		return this.#categoryIds;
	}
	
	set categoryIds(categoryIds: string[]) {
		this.#categoryIds = categoryIds;
		if (this.skill != null && !categoryIds.includes(this.skill.categoryId)) {
			this.skill = undefined;
		}
	}
}