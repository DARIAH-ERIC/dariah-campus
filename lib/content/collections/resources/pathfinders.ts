import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "@/lib/content/keystatic/reader";
import { compile, createFullConfig } from "@/lib/content/mdx-compiler";
import { getImageDimensions } from "@/lib/content/utils/get-image-dimensions";
import { getLastModifiedTimestamp } from "@/lib/content/utils/get-last-modified-timestamp";
import { defaultLocale } from "@/lib/i18n/locales";

const mdxConfig = createFullConfig(defaultLocale);

export const resourcesPathfinders = createCollection({
	name: "resources-pathfinders",
	directory: "./content/en/resources/pathfinders/",
	include: ["*/index.mdx"],
	read(item) {
		return reader.collections["en:resources-pathfinders"].readOrThrow(item.id, {
			resolveLinkedFiles: true,
		});
	},
	async transform(data, item, context) {
		const { content, ...metadata } = data;

		const input = new VFile({ path: item.absoluteFilePath, value: content });
		const output = await compile(input, mdxConfig);
		const module = context.createJavaScriptImport<MDXContent>(String(output));
		const tableOfContents = output.data.tableOfContents;
		const featuredImage =
			metadata["featured-image"] != null
				? await getImageDimensions(metadata["featured-image"])
				: null;

		const lastModified =
			// eslint-disable-next-line no-restricted-syntax
			process.env.NODE_ENV === "production"
				? await getLastModifiedTimestamp(item.absoluteFilePath)
				: null;

		return {
			id: item.id,
			content: module,
			metadata: {
				...metadata,
				"content-type": "pathfinder" as const,
				"featured-image": featuredImage,
			},
			tableOfContents,
			lastModified,
		};
	},
});
