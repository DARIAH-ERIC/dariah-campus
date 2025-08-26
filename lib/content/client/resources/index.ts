import { keyByToMap } from "@acdh-oeaw/lib";

import type { CollectionClient } from "@/lib/content/types";

import { client as events, type EventResource } from "./events";
import { client as external, type ExternalResource } from "./external";
import { client as hosted, type HostedResource } from "./hosted";
import { client as pathfinders, type PathfinderResource } from "./pathfinders";

const ids = [...events.ids(), ...external.ids(), ...hosted.ids(), ...pathfinders.ids()];

const all = [...events.all(), ...external.all(), ...hosted.all(), ...pathfinders.all()].sort(
	(a, z) => {
		return a.metadata["publication-date"].localeCompare(z.metadata["publication-date"]);
	},
);

const byId = keyByToMap(all, (item) => {
	return item.id;
});

type Resource = EventResource | ExternalResource | HostedResource | PathfinderResource;

export const client: CollectionClient<Resource> = {
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
