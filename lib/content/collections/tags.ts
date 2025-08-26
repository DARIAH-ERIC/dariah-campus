import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "@/lib/content/keystatic/reader";
import { compile, createBaseConfig } from "@/lib/content/mdx-compiler";
import { defaultLocale } from "@/lib/i18n/locales";

const mdxConfig = createBaseConfig(defaultLocale);

export const tags = createCollection({
	name: "tags",
	directory: "./content/en/tags/",
	include: ["*/index.mdx"],
	read(item) {
		return reader.collections["en:tags"].readOrThrow(item.id, { resolveLinkedFiles: true });
	},
	async transform(data, item, context) {
		const { content, ...metadata } = data;

		const input = new VFile({ path: item.absoluteFilePath, value: content });
		const output = await compile(input, mdxConfig);
		const module = context.createJavaScriptImport<MDXContent>(String(output));

		return {
			id: item.id,
			content: module,
			metadata,
		};
	},
});
