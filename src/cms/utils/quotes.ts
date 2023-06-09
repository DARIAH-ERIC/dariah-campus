export function encodeQuotes(value: string | undefined): string {
	if (value == null) return "";
	return value.replace(/"/g, "&quot;");
}

export function decodeQuotes(value: string | undefined): string {
	if (value == null) return "";
	return value.replace(/&quot;/g, '"');
}
