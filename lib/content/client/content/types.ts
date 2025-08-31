import { keyByToMap } from "@acdh-oeaw/lib";

import { contentTypes as _collection } from "@/lib/content/options";
import type { CollectionClient } from "@/lib/content/types";

const collection = [
	..._collection,
	{
		value: "event",
		label: "Event",
	},
	{
		value: "pathfinder",
		label: "Pathfinder",
	},
	{
		value: "curriculum",
		label: "Curriculum",
	},
];

const ids = collection.map((item) => {
	return item.value;
});

const all = collection.map((item) => {
	return { id: item.value, label: item.label };
});

const byId = keyByToMap(all, (item) => {
	return item.id;
});

export type ContentType = (typeof all)[number];

export const client: CollectionClient<ContentType> = {
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
