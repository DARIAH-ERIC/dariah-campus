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

export const resourcesEvents = createCollection({
	name: "resources-events",
	directory: "./content/en/resources/events/",
	include: ["*/index.mdx"],
	read(item) {
		return reader.collections["en:resources-events"].readOrThrow(item.id, {
			resolveLinkedFiles: true,
		});
	},
	async transform(data, item, context) {
		const { content, ...metadata } = data;

		const input = new VFile({ path: item.absoluteFilePath, value: content });
		const output = await compile(input, compileOptions);
		const module = context.createJavaScriptImport<MDXContent>(String(output));
		const tableOfContents = output.data.tableOfContents;

		const sessions = [];

		// TODO: p-limit for concurrency
		for (const session of metadata.sessions) {
			const input = new VFile({ path: item.absoluteFilePath, value: session.content });
			const output = await compile(input, compileOptions);
			const module = context.createJavaScriptImport<MDXContent>(String(output));

			const presentations = [];

			// TODO: p-limit for concurrency
			for (const presentation of session.presentations) {
				const input = new VFile({ path: item.absoluteFilePath, value: presentation.content });
				const output = await compile(input, compileOptions);
				const module = context.createJavaScriptImport<MDXContent>(String(output));

				presentations.push({ ...presentation, content: module });
			}

			sessions.push({ ...session, content: module, presentations });
		}

		const featuredImage =
			metadata["featured-image"] != null
				? await getImageDimensions(metadata["featured-image"])
				: null;

		return {
			id: item.id,
			content: module,
			metadata: {
				...metadata,
				"content-type": "event" as const,
				"featured-image": featuredImage,
				sessions,
			},
			tableOfContents,
		};
	},
});
