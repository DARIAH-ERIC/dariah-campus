import { groupByToMap, keyByToMap } from "@acdh-oeaw/lib";
import curricula from "@content/curricula";
import events from "@content/resources-events";
import external from "@content/resources-external";
import hosted from "@content/resources-hosted";
import collection from "@content/resources-pathfinders";

import type { CollectionClient } from "@/lib/content/types";

const curriculaByResourceId = groupByToMap(Array.from(curricula.values()), (entry) => {
	return entry.document.metadata.resources.map((resource) => {
		return resource.value;
	});
});

const resourcesByTagId = groupByToMap(
	[
		...Array.from(events.values()),
		...Array.from(external.values()),
		...Array.from(hosted.values()),
		...Array.from(collection.values()),
	],
	(entry) => {
		return entry.document.metadata.tags;
	},
);

//

const ids = Array.from(collection.keys());

const all = Array.from(collection.values())
	.map((entry) => {
		const href = `/resources/pathfinders/${entry.document.id}`;

		const curricula =
			curriculaByResourceId.get(entry.document.id)?.map((entry) => {
				return entry.document.id;
			}) ?? [];

		const related = new Set<string>();

		entry.document.metadata.tags.forEach((id) => {
			const resources = resourcesByTagId.get(id)!;

			resources.forEach((resource) => {
				const id = resource.document.id;

				if (id !== entry.document.id) {
					related.add(id);
				}
			});
		});

		return {
			...entry.document,
			curricula,
			href,
			kind: "pathfinder",
			related,
		};
	})
	.sort((a, z) => {
		return a.metadata["publication-date"].localeCompare(z.metadata["publication-date"]);
	});

const byId = keyByToMap(all, (item) => {
	return item.id;
});

export type PathfinderResource = (typeof all)[number];

export const client: CollectionClient<PathfinderResource> = {
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
