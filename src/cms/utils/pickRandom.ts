/**
 * Pick n random unique items from array.
 */
export function pickRandom<T extends { id: string }>(items: Array<T>, n: number): Array<T> {
	const itemsById = mapById(items);

	if (itemsById.size <= n) {
		return Array.from(itemsById.values());
	} else {
		const ids = Array.from(itemsById.keys());
		const picked = new Map();
		while (picked.size < n) {
			/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
			const id = ids[Math.floor(Math.random() * ids.length)]!;
			picked.set(id, itemsById.get(id));
		}
		return Array.from(picked.values());
	}
}

/**
 * Maps items by id.
 */
function mapById<T extends { id: string }>(items: Array<T>): Map<string, T> {
	const map = new Map();
	items.forEach((item) => {
		map.set(item.id, item);
	});
	return map;
}
