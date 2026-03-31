import { getStatsFromSpec, toIdString } from '$lib/common.svelte';
import { type gearState } from "$lib/gearState.svelte";
import type { mutagenState } from "../mutagenState.svelte";
import type { mutationState } from "$lib/mutationState.svelte";
import type { skillState } from './skillState.svelte';

export type GeraltContext = {
    gearState: typeof gearState,
    mutagenState: typeof mutagenState,
    mutationState: typeof mutationState,
    skillState: typeof skillState,
}

export type StatEntitySpec = {
    name: string,
    description: string,
    kind: string,
    rank: number,
}

export class GearSlot {
    readonly name: string;
    readonly description: string;
    readonly inventory: Gear[];

    currentGear = $state<Gear>(new Gear({ name: "None", description: "", kind: "", rank: 0 }, this));

    constructor(spec: StatEntitySpec, gearDatas: StatEntitySpec[]) {
        this.name = spec.name;
        this.description = spec.description;
        this.inventory = [this.currentGear, ...gearDatas.map(gearData => new Gear(gearData, this))];
    }
}

export class Gear {
    readonly name: string;
    readonly styleName: string;
    readonly stats: Map<string, number>;
    readonly slot: GearSlot;

    constructor(gearSpec: StatEntitySpec, gearSlot: GearSlot) {
        this.slot = gearSlot;
        this.name = gearSpec.name;
        this.styleName = gearSpec.description ?? this.name.replace(`_${this.slot.name}`, "");
        this.stats = getStatsFromSpec(gearSpec);
    }
    
    // get id(): string { return this.name.toLowerCase().replaceAll(new RegExp(String.raw`[^\w-]|${this.slotId}|${"sword"}`, 'gi'), ''); }

    get iconPath(): string {
        return this.name === "None" ? "" : 
        `images/gear/${`${this.slot.name}-${this.styleName ?? this.name}`.toLowerCase()}.webp`;
    }
}

export class SkillSlot {
    #categoryIds: string[] = $state([]);
    #skill?: Skill = $state();

    constructor(categoryNames: string[] = ["Combat","Signs","Alchemy","General"]) {
        this.categoryIds = categoryNames;
    }

    get skill(): Skill|undefined {
        return this.#skill;
    }

    set skill(skill: Skill|undefined) {
        if (skill instanceof Skill && !this.categoryIds.includes(skill.category.name)) {
            return;
        }
        
        this.#skill = skill;
    }

    get categoryIds(): string[] {
        return this.#categoryIds;
    }

    set categoryIds(categoryIds: string[]) {
        if (this.#categoryIds === categoryIds) {
            return;
        }

        this.#categoryIds = categoryIds;

        if (this.skill instanceof Skill && !categoryIds.includes(this.skill.category.name)) {
            this.skill = undefined;
        }
    }
}

export class SkillCategory {
    readonly name: string;
    readonly description: string;
    readonly subcategories: SkillSubcategory[];
    readonly skills: Skill[];
    readonly tiers: Skill[][];

    constructor(spec: StatEntitySpec, skillAndUpgradeSpecs: [StatEntitySpec, StatEntitySpec[]][], subcategorySpecs: StatEntitySpec[] = []) {
        this.name = spec.name;
        this.description = spec.description;
        this.subcategories = subcategorySpecs.map(subcategorySpec => new SkillSubcategory(subcategorySpec, this));
        this.skills = skillAndUpgradeSpecs.map(skillAndUpgradeSpec => new Skill(
            this.subcategories.find(subcategory => subcategory.name === skillAndUpgradeSpec[0].kind) ?? this,
            skillAndUpgradeSpec[0],
            skillAndUpgradeSpec[1]
        ));
        this.tiers = Map.groupBy(this.skills, skill => skill.tier).values().toArray();

        if (this.name.toLowerCase() === "general" && this.subcategories.length > 0) {
            console.warn(`General category "${this.name}" ERRONEOUSLY has ${this.subcategories.length} subcategories.`);
        }
    }

    get points(): number {
        return this.skills.map(skill => skill.points).reduce((a, b) => a + b, 0);
    }

    get unlockedTiers(): number {
        return this.calculateUnlockedRanks(this.points);
    }

    calculateUnlockedRanks(points: number): number {
        return this.subcategories.length === 0 ? 4 : (1 + Math.floor(points / 6));
    }
}

export class SkillSubcategory {
    readonly name: string;
    readonly description: string;
    readonly category: SkillCategory;
    readonly iconPath: string;

    constructor(spec: StatEntitySpec, skillCategory: SkillCategory) {
        this.name = spec.name;
        this.description = spec.description;
        this.category = skillCategory;
        this.iconPath = `/images/abilities/skills/${skillCategory.name}/${spec.name}.png`.replaceAll("_", "").replaceAll("-", "").toLowerCase();
    }
}

export class Skill {
    readonly name: string;
    readonly iconPath: string;
    readonly category: SkillCategory;
    readonly subcategory: SkillSubcategory|null;
    readonly tier: number;
    readonly levels: { description: string, stats: Map<string, number> }[];

    _points: number = $state(0);

    constructor(categoryOrSubcategory: SkillCategory|SkillSubcategory, spec: StatEntitySpec, upgradeSpecs: StatEntitySpec[]) {
        this.name = spec.name;
        this.tier = spec.rank;
        this.levels = [
            { description: "", stats: getStatsFromSpec({} as StatEntitySpec) },
            { description: spec.description, stats: getStatsFromSpec(spec) },
            ...upgradeSpecs.map(upgradeSpec => ({ description: upgradeSpec.description, stats: getStatsFromSpec(upgradeSpec) }))
        ];

        if (categoryOrSubcategory instanceof SkillCategory) {
            this.subcategory = null;
            this.category = categoryOrSubcategory;
        } else {
            this.subcategory = categoryOrSubcategory;
            this.category = categoryOrSubcategory.category;
        }

        this.iconPath 
        = `/images/abilities/skills/${
            this.category.name
        }/${
            this.subcategory instanceof SkillSubcategory ? 
            this.subcategory.name.concat("/") 
            : ""
        }${
            spec.name
        }.png`.replaceAll("_","").replaceAll("-", "").replaceAll("'", "").toLowerCase();
    }

    get points(): number {
        return this._points;
    }
    set points(val: number) {
        this._points = Math.max(0, Math.min(val, this.levels.length - 1));
    }

    get canIncrease(): boolean {
        return this.points < this.levels.length - 1 && this.category.unlockedTiers >= this.tier;
    }

    get canDecrease(): boolean {
        return this.points > 0 && !this.category.skills.some(skill => 
            skill.points > 0 
            && skill.tier > this.tier
            && this.category.calculateUnlockedRanks(this.category.skills.filter(preskill => preskill.tier < skill.tier).map(preskill => preskill.points).reduce((a, b) => a + b, 0) - 1) < skill.tier
        );
    }

    get currentLevelDescription(): string {
        return this.levels[this.points].description;
    }
    
    get currentLevelStats(): Map<string, number> {
        return this.levels[this.points].stats;
    }

    get progress(): number {
        return this.points / (this.levels.length - 1);
    }

    /*
    get isMax(): boolean {
        return this.points == this.levels.length - 1;
    }

    get isMin(): boolean {
        return this.points == 0;
    }
    /**/
}

export class Mutation {
    readonly id: string = $state("");
    readonly name: string = $state("");
    readonly categoryIds: string[] = $state([]);
    readonly description: string = $state("");
    readonly prerequisiteIds: string[] = $state([]);
    readonly iconPath: string = $state("");

    points: number = $state(0);

    constructor(name: string, points: number, categoryIds: string[], description: string = "", prerequisiteIds: string[] = []) {
        let id = toIdString(name);

        this.id = id;
        this.name = name;
        this.points = points;
        this.categoryIds = categoryIds;
        this.description = description;
        this.prerequisiteIds = prerequisiteIds;
        this.iconPath = `/images/abilities/mutations/${id}.webp`
    }
}

export class MutationSlot {
    #mutation?: Mutation = $state();
    readonly inventory: Mutation[] = $state([]);
    readonly skillSlots: SkillSlot[] = $state([
        new SkillSlot(),
        new SkillSlot(),
        new SkillSlot(),
        new SkillSlot()
    ]);

    constructor(inventory: Mutation[]) {
        this.inventory = inventory;
    }

    get mutation(): Mutation|undefined {
        return this.#mutation;
    }

    set mutation(mutation: Mutation|undefined) {
        if (this.mutation === mutation) {
            return;
        }

        this.#mutation = mutation;
        this.skillSlots.forEach(skillSlot => {
            skillSlot.categoryIds = mutation?.categoryIds ?? []
        })
    }
}

export type Mutagen = {
    name: string,
    categoryId: string,
    iconPath: string,
}

export class MutagenSlot {
    mutagen?: Mutagen = $state();
    readonly inventory: Mutagen[] = $state([
        {
            name: "Greater Blue Mutagen",
            categoryId: "signs",
            iconPath: "/images/mutagens/greaterbluemutagen.webp"
        },
        {
            name: "Greater Green Mutagen",
            categoryId: "alchemy",
            iconPath: "/images/mutagens/greatergreenmutagen.webp"
        },
        {
            name: "Greater Red Mutagen",
            categoryId: "combat",
            iconPath: "/images/mutagens/greaterredmutagen.webp"
        }
    ]);
    readonly skillSlots: SkillSlot[] = $state([
        new SkillSlot(),
        new SkillSlot(),
        new SkillSlot()
    ]);

    // ToDo: get buff() { // check skillSlots to get total buff }
}