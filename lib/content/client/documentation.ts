import { keyByToMap } from "@acdh-oeaw/lib";

import type { CollectionClient } from "#/lib/content/types.ts";
import collection from "#content/documentation";
import navigation from "#content/navigation";

const order = navigation.get("")!.document.documentation.links;

//

const ids = Array.from(collection.keys());

const all = Array.from(collection.values())
	// oxlint-disable-next-line oxc/no-map-spread
	.map((entry) => {
		const href = `/documentation/${entry.document.id}`;

		return {
			...entry.document,
			href,
		};
	})
	// oxlint-disable-next-line unicorn/no-array-sort
	.sort((a, z) => order.findIndex((id) => a.id === id) - order.findIndex((id) => z.id === id));

const byId = keyByToMap(all, (item) => item.id);

export type Documentation = (typeof all)[number];

export const client: CollectionClient<Documentation> = {
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
