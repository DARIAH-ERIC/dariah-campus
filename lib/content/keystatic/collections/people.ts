import { createAssetOptions, createCollection } from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";
import slugify from "@sindresorhus/slugify";

import * as validation from "@/lib/content/keystatic/validation";
import { socialMediaKinds } from "@/lib/content/options";

export const createPeople = createCollection("/people/", (paths, _locale) => {
	return collection({
		label: "People",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "name",
		columns: ["name"],
		entryLayout: "form",
		schema: {
			name: fields.slug({
				name: {
					label: "Name",
					validation: { isRequired: true },
				},
				slug: {
					generate(name) {
						const segments = name.trim().split(" ");
						const lastName = segments.pop();
						return slugify([lastName, ...segments].join(" "));
					},
				},
			}),
			image: fields.image({
				label: "Image",
				validation: { isRequired: true },
				...createAssetOptions(paths.assetPath),
			}),
			social: fields.array(
				fields.conditional(
					fields.select({
						label: "Kind",
						options: socialMediaKinds,
						defaultValue: "website",
					}),
					{
						bluesky: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						email: fields.text({
							label: "URL",
							validation: { isRequired: true, pattern: validation.email },
						}),
						facebook: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						flickr: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						github: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						instagram: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						linkedin: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						mastodon: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						orcid: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						rss: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						twitter: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						website: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						youtube: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
					},
				),
				{
					label: "Social media",
					validation: { length: { min: 0 } },
					itemLabel(props) {
						return props.discriminant;
					},
				},
			),
			content: fields.mdx({
				label: "Description",
				options: {
					blockquote: false,
					codeBlock: false,
					heading: false,
					image: false,
					table: false,
				},
				components: {},
			}),
		},
	});
});
