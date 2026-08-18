import { keyByToMap } from "@acdh-oeaw/lib";

import type { CollectionClient } from "#/lib/content/types.ts";

import { type EventResource, client as events } from "#/lib/content/client/resources/events.ts";
import { type ExternalResource, client as external } from "#/lib/content/client/resources/external.ts";
import { type HostedResource, client as hosted } from "#/lib/content/client/resources/hosted.ts";
import { type PathfinderResource, client as pathfinders } from "#/lib/content/client/resources/pathfinders.ts";

// oxlint-disable-next-line node/no-top-level-await
const ids = (await Promise.all([events.ids(), external.ids(), hosted.ids(), pathfinders.ids()])).flat();

// oxlint-disable-next-line node/no-top-level-await unicorn/no-array-sort
const all = (await Promise.all([events.all(), external.all(), hosted.all(), pathfinders.all()])).flat().sort((a, z) =>
	z.metadata["publication-date"].localeCompare(a.metadata["publication-date"])
);

const byId = keyByToMap(all, (item) =>
	item.id
);

type Resource = EventResource | ExternalResource | HostedResource | PathfinderResource;

export const client: CollectionClient<Resource> = {
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
