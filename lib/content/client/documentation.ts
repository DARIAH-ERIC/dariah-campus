import { keyByToMap } from "@acdh-oeaw/lib";
import collection from "@content/documentation";
import navigation from "@content/navigation";

import type { CollectionClient } from "@/lib/content/types";

const order = navigation.get("")!.document.documentation.links;

//

const ids = Array.from(collection.keys());

const all = Array.from(collection.values())
	.map((entry) => {
		const href = `/documentation/${entry.document.id}`;

		return {
			...entry.document,
			href,
		};
	})
	.sort((a, z) => {
		return (
			order.findIndex((id) => {
				return a.id === id;
			}) -
			order.findIndex((id) => {
				return z.id === id;
			})
		);
	});

const byId = keyByToMap(all, (item) => {
	return item.id;
});

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
