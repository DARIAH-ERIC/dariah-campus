import { createAssetOptions, type Paths, withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";

import type { Locale } from "@/config/i18n.config";
import { linkKinds } from "@/lib/content/options";

export function createLinkSchema<TPath extends `/${string}/`>(
	downloadPath: Paths<TPath>["downloadPath"],
	locale: Locale,
) {
	return fields.conditional(
		fields.select({
			label: "Kind",
			options: linkKinds,
			defaultValue: "external",
		}),
		{
			documentation: fields.relationship({
				label: "Documentation",
				validation: { isRequired: true },
				collection: withI18nPrefix("documentation", locale),
			}),
			download: fields.file({
				label: "Download",
				validation: { isRequired: true },
				...createAssetOptions(downloadPath),
			}),
			external: fields.url({
				label: "URL",
				validation: { isRequired: true },
			}),
			curricula: fields.relationship({
				label: "Curriculum",
				validation: { isRequired: true },
				collection: withI18nPrefix("curricula", locale),
			}),
			"resources-events": fields.relationship({
				label: "Event",
				validation: { isRequired: true },
				collection: withI18nPrefix("resources-events", locale),
			}),
			"resources-external": fields.relationship({
				label: "External resource",
				validation: { isRequired: true },
				collection: withI18nPrefix("resources-external", locale),
			}),
			"resources-hosted": fields.relationship({
				label: "Hosted resource",
				validation: { isRequired: true },
				collection: withI18nPrefix("resources-hosted", locale),
			}),
			"resources-pathfinders": fields.relationship({
				label: "Pathfinder",
				validation: { isRequired: true },
				collection: withI18nPrefix("resources-pathfinders", locale),
			}),
		},
	);
}
