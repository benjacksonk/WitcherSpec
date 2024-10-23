import {capitalizeFirst, toIdString} from '$lib/common.svelte';

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