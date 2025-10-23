import { keyByToMap } from "@acdh-oeaw/lib";

import type { CollectionClient } from "@/lib/content/types";

import { client as events, type EventResource } from "./events";
import { client as external, type ExternalResource } from "./external";
import { client as hosted, type HostedResource } from "./hosted";
import { client as pathfinders, type PathfinderResource } from "./pathfinders";

const ids = (
	await Promise.all([events.ids(), external.ids(), hosted.ids(), pathfinders.ids()])
).flat();

const all = (await Promise.all([events.all(), external.all(), hosted.all(), pathfinders.all()]))
	.flat()
	.sort((a, z) => {
		return z.metadata["publication-date"].localeCompare(a.metadata["publication-date"]);
	});

const byId = keyByToMap(all, (item) => {
	return item.id;
});

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
