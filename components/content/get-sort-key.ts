/**
 * Stable string hash used to order the items an exercise offers. Sorting by it scrambles them without correlating to
 * the order in which the answers were authored, and gives the same result on the server and the client - a random
 * shuffle would not survive hydration.
 */
export function getSortKey(value: string): number {
	let n = 0;
	for (let i = 0; i < value.length; i++) {
		// oxlint-disable-next-line unicorn/prefer-code-point
		n = (n * 31 + value.charCodeAt(i)) % 2147483647;
	}
	return n;
}
