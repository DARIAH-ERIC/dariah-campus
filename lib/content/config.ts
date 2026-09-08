import { createConfig } from "@acdh-oeaw/content-lib";

import { curricula } from "#/lib/content/collections/curricula.ts";
import { documentation } from "#/lib/content/collections/documentation.ts";
import { people } from "#/lib/content/collections/people.ts";
import { resourcesEvents } from "#/lib/content/collections/resources/events.ts";
import { resourcesExternal } from "#/lib/content/collections/resources/external.ts";
import { resourcesHosted } from "#/lib/content/collections/resources/hosted.ts";
import { resourcesPathfinders } from "#/lib/content/collections/resources/pathfinders.ts";
import { sources } from "#/lib/content/collections/sources.ts";
import { tags } from "#/lib/content/collections/tags.ts";
import { indexPage } from "#/lib/content/singletons/index-page.ts";
import { legalNotice } from "#/lib/content/singletons/legal-notice.ts";
import { navigation } from "#/lib/content/singletons/navigation.ts";

export const config = createConfig({
	collections: [
		curricula,
		documentation,
		people,
		resourcesEvents,
		resourcesExternal,
		resourcesHosted,
		resourcesPathfinders,
		sources,
		tags,

		indexPage,
		legalNotice,
		navigation,
	],
});
