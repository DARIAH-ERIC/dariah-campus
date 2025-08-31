import { keyByToMap } from "@acdh-oeaw/lib";

import { contentLanguages as collection } from "@/lib/content/options";
import type { CollectionClient } from "@/lib/content/types";

const ids = collection.map((item) => {
	return item.value;
});

const all = collection.map((item) => {
	return { id: item.value, label: item.label };
});

const byId = keyByToMap(all, (item) => {
	return item.id;
});

export type ContentLanguage = (typeof all)[number];

export const client: CollectionClient<ContentLanguage> = {
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
