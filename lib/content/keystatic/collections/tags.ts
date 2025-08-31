import { createCollection } from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

export const createTags = createCollection("/tags/", (paths, _locale) => {
	return collection({
		label: "Tags",
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
			}),
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
