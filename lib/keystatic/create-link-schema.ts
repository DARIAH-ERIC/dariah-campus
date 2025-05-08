import { createAssetOptions, type Paths, withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";

import type { Language } from "@/config/i18n.config";
import { linkKinds } from "@/lib/content/options";
import * as validation from "@/lib/keystatic/validation";

export function createLinkSchema<TPath extends `/${string}/`>(
	downloadPath: Paths<TPath>["downloadPath"],
	locale: Language,
) {
	return fields.conditional(
		fields.select({
			label: "Kind",
			options: linkKinds,
			defaultValue: "external",
		}),
		{
			external: fields.url({
				label: "URL",
				validation: { isRequired: true },
			}),
			hash: fields.text({
				label: "Heading identifier",
				description: "For example `#first-heading`.",
				validation: { isRequired: true, pattern: validation.urlFragment },
			}),
			download: fields.file({
				label: "Download",
				validation: { isRequired: true },
				...createAssetOptions(downloadPath),
			}),
			"resources-events": fields.object({
				id: fields.relationship({
					label: "Event",
					validation: { isRequired: true },
					collection: withI18nPrefix("resources-events", locale),
				}),
				hash: fields.text({
					label: "URL fragment",
					description: "For example `#first-heading`.",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
			"resources-external": fields.object({
				id: fields.relationship({
					label: "External resource",
					validation: { isRequired: true },
					collection: withI18nPrefix("resources-external", locale),
				}),
				hash: fields.text({
					label: "URL fragment",
					description: "For example `#first-heading`.",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
			"resources-hosted": fields.object({
				id: fields.relationship({
					label: "Hosted resource",
					validation: { isRequired: true },
					collection: withI18nPrefix("resources-hosted", locale),
				}),
				hash: fields.text({
					label: "URL fragment",
					description: "For example `#first-heading`.",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
			"resources-pathfinders": fields.object({
				id: fields.relationship({
					label: "Pathfinder",
					validation: { isRequired: true },
					collection: withI18nPrefix("resources-pathfinders", locale),
				}),
				hash: fields.text({
					label: "URL fragment",
					description: "For example `#first-heading`.",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
			curricula: fields.object({
				id: fields.relationship({
					label: "Curriculum",
					validation: { isRequired: true },
					collection: withI18nPrefix("curricula", locale),
				}),
				hash: fields.text({
					label: "URL fragment",
					description: "For example `#first-heading`.",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
			search: fields.object({
				search: fields.text({
					label: "Search params",
					description: "For example `?q=dariah`.",
					validation: { isRequired: false, pattern: validation.urlSearchParamsOptional },
				}),
				hash: fields.text({
					label: "URL fragment",
					description: "For example `#first-heading`.",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
			documentation: fields.object({
				id: fields.relationship({
					label: "Documentation",
					validation: { isRequired: true },
					collection: withI18nPrefix("documentation", locale),
				}),
				hash: fields.text({
					label: "URL fragment",
					description: "For example `#first-heading`.",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
		},
	);
}
