import { keyByToMap } from "@acdh-oeaw/lib";
import collection from "@content/people";

import type { CollectionClient } from "@/lib/content/types";

const ids = Array.from(collection.keys());

const all = Array.from(collection.values())
	.map((entry) => {
		return entry.document;
	})
	.sort((a, z) => {
		return a.metadata.name.localeCompare(z.metadata.name);
	});

const byId = keyByToMap(all, (item) => {
	return item.id;
});

export type Person = (typeof all)[number];

export const client: CollectionClient<Person> = {
	ids() {
		return ids;
	},
	all() {
		return all;
	},
	byId() {
		return byId;
	},
	get(id: (typeof ids)[number]) {
		return byId.get(id) ?? null;
	},
};
