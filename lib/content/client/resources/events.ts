import { groupByToMap, keyByToMap } from "@acdh-oeaw/lib";

import type { CollectionClient } from "#/lib/content/types";
import curricula from "#content/curricula";
import collection from "#content/resources-events";
import external from "#content/resources-external";
import hosted from "#content/resources-hosted";
import pathfinders from "#content/resources-pathfinders";

const curriculaByResourceId = groupByToMap(Array.from(curricula.values()), (entry) =>
	entry.document.metadata.resources.map((resource) => resource.value),
);

const resourcesByTagId = groupByToMap(
	[
		...Array.from(collection.values()),
		...Array.from(external.values()),
		...Array.from(hosted.values()),
		...Array.from(pathfinders.values()),
	],
	(entry) => entry.document.metadata.tags,
);

//

const ids = Array.from(collection.keys());

const all = Array.from(collection.values())
	// oxlint-disable-next-line oxc/no-map-spread
	.map((entry) => {
		const href = `/resources/events/${entry.document.id}`;

		const curricula = curriculaByResourceId.get(entry.document.id)?.map((entry) => entry.document.id) ?? [];

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
			kind: "event",
			related,
		};
	})
	// oxlint-disable-next-line unicorn/no-array-sort
	.sort((a, z) => z.metadata["publication-date"].localeCompare(a.metadata["publication-date"]));

const byId = keyByToMap(all, (item) => item.id);

export type EventResource = (typeof all)[number];

export const client: CollectionClient<EventResource> = {
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
