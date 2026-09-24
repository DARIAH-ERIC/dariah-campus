import "server-nodejs-only";

import { client as contentLanguages } from "#/lib/content/client/content/languages.ts";
import { client as contentLicenses } from "#/lib/content/client/content/licenses.ts";
import { client as contentTypes } from "#/lib/content/client/content/types.ts";
import { client as curricula } from "#/lib/content/client/curricula.ts";
import { client as documentation } from "#/lib/content/client/documentation.ts";
import { client as indexPage } from "#/lib/content/client/index-page.ts";
import { client as legalNotice } from "#/lib/content/client/legal-notice.ts";
import { client as navigation } from "#/lib/content/client/navigation.ts";
import { client as people } from "#/lib/content/client/people.ts";
import { client as resourcesEvents } from "#/lib/content/client/resources/events.ts";
import { client as resourcesExternal } from "#/lib/content/client/resources/external.ts";
import { client as resourcesHosted } from "#/lib/content/client/resources/hosted.ts";
import { client as resources } from "#/lib/content/client/resources/index.ts";
import { client as resourcesPathfinders } from "#/lib/content/client/resources/pathfinders.ts";
import { client as sources } from "#/lib/content/client/sources.ts";
import { client as tags } from "#/lib/content/client/tags.ts";
import type { Client } from "#/lib/content/types.ts";

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
