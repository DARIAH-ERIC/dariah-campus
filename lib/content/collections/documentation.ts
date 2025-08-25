import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "@/lib/content/keystatic/reader";
import { compile, createFullConfig } from "@/lib/content/mdx-compiler";
import { defaultLocale } from "@/lib/i18n/locales";

const mdxConfig = createFullConfig(defaultLocale);

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
		const output = await compile(input, mdxConfig);
		const module = context.createJavaScriptImport<MDXContent>(String(output));
		const tableOfContents = output.data.tableOfContents;

		return {
			id: item.id,
			content: module,
			metadata,
			tableOfContents,
		};
	},
});
