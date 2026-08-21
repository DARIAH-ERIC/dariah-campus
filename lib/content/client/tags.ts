import { groupByToMap, keyByToMap } from "@acdh-oeaw/lib";

import type { CollectionClient } from "#/lib/content/types.ts";
import curricula from "#content/curricula";
import events from "#content/resources-events";
import external from "#content/resources-external";
import hosted from "#content/resources-hosted";
import pathfinders from "#content/resources-pathfinders";
import collection from "#content/tags";

const resourcesByTagId = groupByToMap(
	[
		...Array.from(events.values()),
		...Array.from(external.values()),
		...Array.from(hosted.values()),
		...Array.from(pathfinders.values()),
	],
	(entry) => entry.document.metadata.tags,
);

const curriculaByTagId = groupByToMap(Array.from(curricula.values()), (entry) => entry.document.metadata.tags);

//

const ids = Array.from(collection.keys());

const all = Array.from(collection.values())
	// oxlint-disable-next-line oxc/no-map-spread
	.map((entry) => {
		const href = `/topics/${entry.document.id}`;

		const resources = resourcesByTagId.get(entry.document.id)?.map((entry) => entry.document.id) ?? [];

		const curricula = curriculaByTagId.get(entry.document.id)?.map((entry) => entry.document.id) ?? [];

		return {
			...entry.document,
			href,
			curricula,
			resources,
		};
	})
	// oxlint-disable-next-line unicorn/no-array-sort
	.sort((a, z) => a.metadata.name.localeCompare(z.metadata.name));

const byId = keyByToMap(all, (item) => item.id);

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
