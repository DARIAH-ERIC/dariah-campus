import { readFile } from "node:fs/promises";

import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { compile, createBaseConfig } from "@/lib/content/mdx-compiler";
import { defaultLocale } from "@/lib/i18n/locales";

// import { reader } from "@/lib/content/keystatic/reader";

const mdxConfig = createBaseConfig(defaultLocale);

export const legalNotice = createCollection({
	name: "legal-notice",
	directory: "./content/en/legal-notice/",
	include: ["index.mdx"],
	read() {
		/** Currently not editable via cms. */
		// return reader.singletons["en:legal-notice"].readOrThrow({ resolveLinkedFiles: true });
		return readFile("./content/en/legal-notice/index.mdx", { encoding: "utf-8" });
	},
	async transform(content, item, context) {
		const input = new VFile({ path: item.absoluteFilePath, value: content });
		const output = await compile(input, mdxConfig);
		const module = context.createJavaScriptImport<MDXContent>(String(output));

		return {
			id: item.id,
			content: module,
		};
	},
});
