import { getSortKey } from "#/components/content/get-sort-key.ts";
import type { DropZoneItem } from "#/components/content/quiz-drop-zone-items.tsx";

/** An item as the cms writes it. Kept an object so a field can be added to it without rewriting existing content. */
export interface Item {
	label: string;
}

/**
 * A list of items from the cms, or - in hand-written mdx, where an object per item would only be noise - a list of
 * labels or a single comma separated string.
 */
export type ItemsInput = Array<Item> | Array<string> | string | undefined;

export function toItems(value: ItemsInput): Array<Item> {
	if (value == null) {
		return [];
	}

	const entries = typeof value === "string" ? value.split(",") : value;

	return entries
		.map((entry) => {
			return { label: (typeof entry === "string" ? entry : entry.label).trim() };
		})
		.filter((entry) => entry.label !== "");
}

/**
 * The bank of a drop zone exercise. Every zone contributes the items which belong in it, and the distractors belong in
 * none. They are ordered so the two are indistinguishable, and so the bank does not give away which zone an item was
 * authored for.
 */
export function getDropZoneItems(zoneItems: Array<ItemsInput>, distractors: ItemsInput): Array<DropZoneItem> {
	return [
		...zoneItems.flatMap((items, zoneIndex) =>
			toItems(items).map((item, index) => {
				return { id: `item-${String(zoneIndex)}-${String(index)}`, label: item.label, zoneIndex };
			}),
		),
		...toItems(distractors).map((item, index) => {
			return { id: `distractor-${String(index)}`, label: item.label, zoneIndex: null };
		}),
		// oxlint-disable-next-line unicorn/no-array-sort
	].sort((a, b) => getSortKey(a.label) - getSortKey(b.label));
}
