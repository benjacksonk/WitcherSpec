import { toIdString } from '$lib/common.svelte';
import { getStatsFromSpec, type GearState } from "$lib/gearState.svelte";
import type { mutagenState } from "../mutagenState.svelte";
import type { mutationState } from "$lib/mutationState.svelte";
import type { skillState } from "$lib/skillState.svelte";

export type GeraltContext = {
    gearState: typeof GearState,
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

export class Skill {
    readonly id: string = $state("");
    readonly name: string = $state("");
    readonly categoryId: string = $state("");
    readonly iconPath: string = $state("");
    readonly maxPoints: number = $state(0);
    readonly description: string = $state("");

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
    readonly skills: Skill[] = $state([]);
    readonly prerequisitePoints: number = $state(0);
    readonly prerequisiteTiers: SkillTier[] = $state([]);
    #tiersAfter: SkillTier[] = $state([]);

    constructor(skills: Skill[], prerequisiteTiers: SkillTier[] = []) {
        this.skills = skills;
        this.prerequisiteTiers = prerequisiteTiers;
        this.prerequisitePoints = 6 * prerequisiteTiers.length;
    }

    get points() {
        return this.skills
            .map(({points}) => points)
            .reduce((a, b) => a + b, 0);
    }

    get pointsBefore(): number {
        return this.prerequisiteTiers
            .map(({points}) => points)
            .reduce((a, b) => a + b, 0);
    }

    get canIncrease(): boolean {
        return this.pointsBefore >= this.prerequisitePoints;
    }

    get canDecrease(): boolean {
        return !this.#tiersAfter.some(otherTier =>
            otherTier.points > 0
            && otherTier.pointsBefore - 1 < otherTier.prerequisitePoints
        );
    }

    setTiersAfter(tiersAfter: SkillTier[]) {
        if (this.#tiersAfter !== tiersAfter) {
            this.#tiersAfter = tiersAfter;
        }
    }
}

export type SkillSubcategory = {
    id: string,
    name: string,
    iconPath: string,
}

export class SkillCategory {
    readonly id: string = $state("");
    readonly name: string = $state("");
    readonly tiers: SkillTier[] = $state([]);
    readonly subcategories: SkillSubcategory[] = $state([]);

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
        if (this.#categoryIds === categoryIds) {
            return;
        }

        this.#categoryIds = categoryIds;
        if (this.skill !== undefined && !categoryIds.includes(this.skill.categoryId)) {
            this.skill = undefined;
        }
    }
}

export class Mutation {
    readonly id: string = $state("");
    readonly name: string = $state("");
    points: number = $state(0);
    readonly categoryIds: string[] = $state([]);
    readonly description: string = $state("");
    readonly prerequisiteIds: string[] = $state([]);
    readonly iconPath: string = $state("");

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