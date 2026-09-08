import { groupByToMap, keyByToMap, unique } from "@acdh-oeaw/lib";

import type { CollectionClient } from "#/lib/content/types";
import curricula from "#content/curricula";
import collection from "#content/people";
import events from "#content/resources-events";
import external from "#content/resources-external";
import hosted from "#content/resources-hosted";
import pathfinders from "#content/resources-pathfinders";

/** Not every collection has all of these fields, e.g. events only have authors. */
function getPersonIds(metadata: {
	authors?: Array<string>;
	contributors?: Array<string>;
	editors?: Array<string>;
}): Array<string> {
	const { authors = [], contributors = [], editors = [] } = metadata;

	return unique([...authors, ...editors, ...contributors]);
}

const resourcesByPersonId = groupByToMap(
	[
		...Array.from(events.values()),
		...Array.from(external.values()),
		...Array.from(hosted.values()),
		...Array.from(pathfinders.values()),
	],
	(entry) => getPersonIds(entry.document.metadata),
);

const curriculaByPersonId = groupByToMap(Array.from(curricula.values()), (entry) =>
	getPersonIds(entry.document.metadata),
);

//

const ids = Array.from(collection.keys());

const all = Array.from(collection.values())
	// oxlint-disable-next-line oxc/no-map-spread
	.map((entry) => {
		const href = `/people/${entry.document.id}`;

		const resources = resourcesByPersonId.get(entry.document.id)?.map((entry) => entry.document.id) ?? [];

		const curricula = curriculaByPersonId.get(entry.document.id)?.map((entry) => entry.document.id) ?? [];

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

export type Person = (typeof all)[number];

export const client: CollectionClient<Person> = {
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
