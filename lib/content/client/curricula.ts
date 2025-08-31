import { groupByToMap, keyByToMap } from "@acdh-oeaw/lib";
import collection from "@content/curricula";

import type { CollectionClient } from "@/lib/content/types";

const byTagId = groupByToMap(Array.from(collection.values()), (entry) => {
	return entry.document.metadata.tags;
});

//

const ids = Array.from(collection.keys());

const all = Array.from(collection.values())
	.map((entry) => {
		const href = `/curricula/${entry.document.id}`;

		const related = new Set<string>();

		entry.document.metadata.tags.forEach((id) => {
			const curricula = byTagId.get(id)!;

			curricula.forEach((curriculum) => {
				const id = curriculum.document.id;

				if (id !== entry.document.id) {
					related.add(id);
				}
			});
		});

		return {
			...entry.document,
			href,
			related,
		};
	})
	.sort((a, z) => {
		return z.metadata["publication-date"].localeCompare(a.metadata["publication-date"]);
	});

const byId = keyByToMap(all, (item) => {
	return item.id;
});

export type Curriculum = (typeof all)[number];

export const client: CollectionClient<Curriculum> = {
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
