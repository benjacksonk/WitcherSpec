export function toIdString(str: string) {
	return str.toLowerCase().replaceAll(/\W/g,'');
}

export function toTitleCase(str: string) {
	return str.replaceAll(/(\b\w)/g, (match, it) => it.toUpperCase());
}

export function capitalizeFirst(str: string) {
	return str.replace(/(\b\w)/, (match, it) => it.toUpperCase());
}