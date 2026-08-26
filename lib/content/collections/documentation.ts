import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "#/lib/content/keystatic/reader.ts";
import { type CompileOptions, compile } from "#/lib/content/mdx/compile.ts";
import {
	createContentSectionsPlugin,
	createCustomHeadingIdsPlugin,
	createHeadingIdsPlugin,
	createIframeTitlesPlugin,
	createImageSizesPlugin,
	createMermaidDiagramsPlugin,
	createSyntaxHighlighterPlugin,
	createTableOfContentsPlugin,
	createUnwrappedMdxFlowContentPlugin,
} from "#/lib/content/mdx/rehype-plugins.ts";
import {
	createDragTheWordsPlugin,
	createFillInTheBlankPlugin,
	createFootnotesPlugin,
	createGitHubMarkdownPlugin,
	createTypographicQuotesPlugin,
} from "#/lib/content/mdx/remark-plugins.ts";
import { createRemarkRehypeOptions } from "#/lib/content/mdx/remark-rehype-options.ts";
import { defaultLocale, getIntlLanguage } from "#/lib/i18n/locales.ts";

const locale = defaultLocale;

const compileOptions: CompileOptions = {
	remarkPlugins: [
		createGitHubMarkdownPlugin(),
		createFootnotesPlugin(),
		createTypographicQuotesPlugin(getIntlLanguage(locale)),
		createFillInTheBlankPlugin(),
		createDragTheWordsPlugin(),
	],
	remarkRehypeOptions: createRemarkRehypeOptions(locale),
	rehypePlugins: [
		createCustomHeadingIdsPlugin(),
		createHeadingIdsPlugin(),
		createIframeTitlesPlugin(["Embed", "Video"]),
		createImageSizesPlugin([
			"CarouselItem",
			"Figure",
			"ImageLayer",
			"QuizImageDropZones",
			"QuizImageHotspots",
			"VideoCard",
		]),
		createMermaidDiagramsPlugin(),
		createSyntaxHighlighterPlugin(),
		createContentSectionsPlugin(),
		createTableOfContentsPlugin(),
		createUnwrappedMdxFlowContentPlugin(["LinkButton"]),
	],
};

export const documentation = createCollection({
	name: "documentation",
	directory: "./content/en/documentation/",
	include: ["*/index.mdx"],
	read(item) {
		return reader.collections["en:documentation"].readOrThrow(item.id, {
			resolveLinkedFiles: true,
		});
	},
	async transform(data, item, context) {
		const { content, ...metadata } = data;

		const input = new VFile({ path: item.absoluteFilePath, value: content });
		const output = await compile(input, compileOptions);
		const module = context.createJavaScriptImport<MDXContent>(String(output));
		const tableOfContents = output.data.tableOfContents;
		const sections = output.data.sections ?? [];

		return {
			id: item.id,
			content: module,
			metadata,
			sections,
			tableOfContents,
		};
	},
});
