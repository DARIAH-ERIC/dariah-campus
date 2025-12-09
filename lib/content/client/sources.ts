import { groupByToMap, keyByToMap } from "@acdh-oeaw/lib";
import events from "@content/resources-events";
import external from "@content/resources-external";
import hosted from "@content/resources-hosted";
import pathfinders from "@content/resources-pathfinders";
import collection from "@content/sources";

import type { CollectionClient } from "@/lib/content/types";

const resourcesBySourceId = groupByToMap(
	[
		...Array.from(events.values()),
		...Array.from(external.values()),
		...Array.from(hosted.values()),
		...Array.from(pathfinders.values()),
	],
	(entry) => {
		return entry.document.metadata.sources;
	},
);

//

const ids = Array.from(collection.keys());

const all = Array.from(collection.values())
	.map((entry) => {
		const href = `/sources/${entry.document.id}`;

		const resources =
			resourcesBySourceId.get(entry.document.id)?.map((entry) => {
				return entry.document.id;
			}) ?? [];

		return {
			...entry.document,
			href,
			resources,
		};
	})
	.sort((a, z) => {
		return a.metadata.name.localeCompare(z.metadata.name);
	});

const byId = keyByToMap(all, (item) => {
	return item.id;
});

export type Source = (typeof all)[number];

export const client: CollectionClient<Source> = {
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
