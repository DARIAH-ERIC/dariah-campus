import { createConfig } from "@acdh-oeaw/content-lib";

import { curricula } from "@/lib/content/collections/curricula";
import { documentation } from "@/lib/content/collections/documentation";
import { people } from "@/lib/content/collections/people";
import { resourcesEvents } from "@/lib/content/collections/resources/events";
import { resourcesExternal } from "@/lib/content/collections/resources/external";
import { resourcesHosted } from "@/lib/content/collections/resources/hosted";
import { resourcesPathfinders } from "@/lib/content/collections/resources/pathfinders";
import { sources } from "@/lib/content/collections/sources";
import { tags } from "@/lib/content/collections/tags";
import { indexPage } from "@/lib/content/singletons/index-page";
import { legalNotice } from "@/lib/content/singletons/legal-notice";
import { navigation } from "@/lib/content/singletons/navigation";

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
