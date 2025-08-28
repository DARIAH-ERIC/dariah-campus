import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "@/lib/content/keystatic/reader";
import { compile, type CompileOptions } from "@/lib/content/mdx/compile";
import {
	createCustomHeadingIdsPlugin,
	createHeadingIdsPlugin,
	createIframeTitlesPlugin,
	createImageSizesPlugin,
	createSyntaxHighlighterPlugin,
	createTableOfContentsPlugin,
	createUnwrappedMdxFlowContentPlugin,
} from "@/lib/content/mdx/rehype-plugins";
import {
	createFootnotesPlugin,
	createGitHubMarkdownPlugin,
	createTypographicQuotesPlugin,
} from "@/lib/content/mdx/remark-plugins";
import { createRemarkRehypeOptions } from "@/lib/content/mdx/remark-rehype-options";
import { getImageDimensions } from "@/lib/content/utils/get-image-dimensions";
import { getLastModifiedTimestamp } from "@/lib/content/utils/get-last-modified-timestamp";
import { defaultLocale, getIntlLanguage } from "@/lib/i18n/locales";

const locale = defaultLocale;

const compileOptions: CompileOptions = {
	remarkPlugins: [
		createGitHubMarkdownPlugin(),
		createFootnotesPlugin(),
		createTypographicQuotesPlugin(getIntlLanguage(locale)),
	],
	remarkRehypeOptions: createRemarkRehypeOptions(locale),
	rehypePlugins: [
		createCustomHeadingIdsPlugin(),
		createHeadingIdsPlugin(),
		createIframeTitlesPlugin(["Embed", "Video"]),
		createImageSizesPlugin(["Figure"]),
		createSyntaxHighlighterPlugin(),
		createTableOfContentsPlugin(),
		createUnwrappedMdxFlowContentPlugin(["LinkButton"]),
	],
};

export const resourcesHosted = createCollection({
	name: "resources-hosted",
	directory: "./content/en/resources/hosted/",
	include: ["*/index.mdx"],
	read(item) {
		return reader.collections["en:resources-hosted"].readOrThrow(item.id, {
			resolveLinkedFiles: true,
		});
	},
	async transform(data, item, context) {
		const { content, ...metadata } = data;

		const input = new VFile({ path: item.absoluteFilePath, value: content });
		const output = await compile(input, compileOptions);
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
				"featured-image": featuredImage,
			},
			tableOfContents,
			lastModified,
		};
	},
});
