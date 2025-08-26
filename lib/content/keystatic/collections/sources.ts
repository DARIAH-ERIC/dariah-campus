import { createAssetOptions, createCollection } from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

// import { createPreviewUrl } from "@/lib/content/keystatic/utils/create-preview-url";

export const createSources = createCollection("/sources/", (paths, _locale) => {
	return collection({
		label: "Sources",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "name",
		columns: ["name"],
		entryLayout: "form",
		// previewUrl: createPreviewUrl("/sources/{slug}"),
		schema: {
			name: fields.slug({
				name: {
					label: "Name",
					validation: { isRequired: true },
				},
			}),
			image: fields.image({
				label: "Image",
				validation: { isRequired: true },
				...createAssetOptions(paths.assetPath),
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
