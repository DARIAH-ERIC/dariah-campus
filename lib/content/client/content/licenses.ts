import { keyByToMap } from "@acdh-oeaw/lib";

import { contentLicenses as collection } from "@/lib/content/options";
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

export type ContentLicense = (typeof all)[number];

export const client: CollectionClient<ContentLicense> = {
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
