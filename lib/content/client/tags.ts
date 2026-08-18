import { keyByToMap } from "@acdh-oeaw/lib";
import collection from "#content/tags";

import type { CollectionClient } from "#/lib/content/types.ts";

const ids = Array.from(collection.keys());

const all = Array.from(collection.values())
	.map((entry) =>
		entry.document
	)
	// oxlint-disable-next-line unicorn/no-array-sort
	.sort((a, z) =>
		a.metadata.name.localeCompare(z.metadata.name)
	);

const byId = keyByToMap(all, (item) =>
	item.id
);

export type Tag = (typeof all)[number];

export const client: CollectionClient<Tag> = {
	ids() {
		return Promise.resolve(ids);
	},
	all() {
		return Promise.resolve(all);
	},
	byId() {
		return Promise.resolve(byId);
	},
	get(id: (typeof ids)[number]) {
		return Promise.resolve(byId.get(id) ?? null);
	},
};
