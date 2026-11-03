import { getSortKey } from "#/components/content/get-sort-key.ts";

/**
 * The order an exercise starts from, as indices into `labels` - whose own order is the solution. Sorting by a hash of
 * the label scrambles the entries the same way on the server and the client, which a random shuffle would not. A
 * scramble which happens to be the solution is rotated by one, so the exercise never starts out already solved.
 */
export function getScrambledOrder(labels: Array<string>): Array<number> {
	const order = labels
		.map((label, index) => {
			return { index, key: getSortKey(label) };
		})
		// oxlint-disable-next-line unicorn/no-array-sort
		.sort((a, b) => a.key - b.key)
		.map((entry) => entry.index);

	if (order.length > 1 && order.every((index, position) => index === position)) {
		order.push(order.shift()!);
	}

	return order;
}
