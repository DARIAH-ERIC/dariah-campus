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
	createMermaidDiagramsPlugin,
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
		createImageSizesPlugin(["Figure", "VideoCard"]),
		createMermaidDiagramsPlugin(),
		createSyntaxHighlighterPlugin(),
		createTableOfContentsPlugin(),
		createUnwrappedMdxFlowContentPlugin(["LinkButton"]),
	],
};

export const curricula = createCollection({
	name: "curricula",
	directory: "./content/en/curricula/",
	include: ["*/index.mdx"],
	read(item) {
		return reader.collections["en:curricula"].readOrThrow(item.id, { resolveLinkedFiles: true });
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

		return {
			id: item.id,
			content: module,
			metadata: {
				...metadata,
				"content-type": "curriculum" as const,
				"featured-image": featuredImage,
			},
			tableOfContents,
		};
	},
});
