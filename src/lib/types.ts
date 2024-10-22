import { capitalizeFirst } from '$lib/common.svelte';

export class Gear {
	id: string = "";
	name: string = "";
	iconPath: string = "";
	slotId: string = "";
}

export class GearSlot {
	id: string = "";
	name: string = "";
	currentGear: Gear;
	inventory: Gear[] = [];
	
	constructor(id: string, inventory: Gear[] = []) {
		this.id = id;
		this.name = capitalizeFirst(id);
		this.currentGear = inventory[0];
		this.inventory = inventory;
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