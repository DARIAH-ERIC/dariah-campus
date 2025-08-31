import "server-nodejs-only";

import { client as contentLanguages } from "@/lib/content/client/content/languages";
import { client as contentLicenses } from "@/lib/content/client/content/licenses";
import { client as contentTypes } from "@/lib/content/client/content/types";
import { client as curricula } from "@/lib/content/client/curricula";
import { client as documentation } from "@/lib/content/client/documentation";
import { client as indexPage } from "@/lib/content/client/index-page";
import { client as legalNotice } from "@/lib/content/client/legal-notice";
import { client as navigation } from "@/lib/content/client/navigation";
import { client as people } from "@/lib/content/client/people";
import { client as resources } from "@/lib/content/client/resources";
import { client as resourcesEvents } from "@/lib/content/client/resources/events";
import { client as resourcesExternal } from "@/lib/content/client/resources/external";
import { client as resourcesHosted } from "@/lib/content/client/resources/hosted";
import { client as resourcesPathfinders } from "@/lib/content/client/resources/pathfinders";
import { client as sources } from "@/lib/content/client/sources";
import { client as tags } from "@/lib/content/client/tags";
import type { Client } from "@/lib/content/types";

export const client = {
	collections: {
		contentLanguages,
		contentLicenses,
		contentTypes,
		curricula,
		documentation,
		people,
		resources,
		resourcesEvents,
		resourcesExternal,
		resourcesHosted,
		resourcesPathfinders,
		sources,
		tags,
	},
	singletons: {
		indexPage,
		legalNotice,
		navigation,
	},
} satisfies Client;
