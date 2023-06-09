/**
 * Capitalizes a unicode string.
 */
export function capitalize(str: string): string {
	const charCode = str.codePointAt(0);
	if (charCode === undefined) return "";
	const firstChar = String.fromCodePoint(charCode);
	return firstChar.toUpperCase() + str.slice(firstChar.length);
}
