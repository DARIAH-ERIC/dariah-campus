import { createSingleton } from "@acdh-oeaw/keystatic-lib";
import { fields, singleton } from "@keystatic/core";

import * as validation from "@/lib/content/keystatic/validation";
import { socialMediaKinds } from "@/lib/content/options";

export const createMetadata = createSingleton("/metadata/", (paths, _locale) => {
	return singleton({
		label: "Metadata",
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			title: fields.text({
				label: "Title",
				validation: { isRequired: true },
			}),
			description: fields.text({
				label: "Description",
				validation: { isRequired: true },
			}),
			creator: fields.text({
				label: "Creator",
				validation: { isRequired: true },
			}),
			twitter: fields.object(
				{
					creator: fields.text({
						label: "Creator",
						validation: { isRequired: true, pattern: validation.twitter },
					}),
					site: fields.text({
						label: "Site",
						validation: { isRequired: true, pattern: validation.twitter },
					}),
				},
				{
					label: "Twitter",
				},
			),
			manifest: fields.object(
				{
					name: fields.text({
						label: "Name",
						validation: { isRequired: true },
					}),
					"short-name": fields.text({
						label: "Short name",
						validation: { isRequired: true },
					}),
					description: fields.text({
						label: "Description",
						validation: { isRequired: true },
					}),
				},
				{
					label: "Webmanifest",
				},
			),
			social: fields.array(
				fields.object(
					{
						kind: fields.select({
							label: "Kind",
							options: socialMediaKinds,
							defaultValue: "website",
						}),
						href: fields.url({
							label: "URL",
						}),
					},
					{
						label: "Social",
					},
				),
				{
					label: "Social media",
					validation: { length: { min: 1 } },
					itemLabel(props) {
						return props.fields.kind.value;
					},
				},
			),
		},
	});
});
