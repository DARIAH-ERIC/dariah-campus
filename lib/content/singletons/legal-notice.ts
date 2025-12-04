import { readFile } from "node:fs/promises";

import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

// import { reader } from "@/lib/content/keystatic/reader";
import { compile, type CompileOptions } from "@/lib/content/mdx/compile";
import {
	createGitHubMarkdownPlugin,
	createTypographicQuotesPlugin,
	createUnwrappedAutolinkLiteralsPlugin,
} from "@/lib/content/mdx/remark-plugins";
import { createRemarkRehypeOptions } from "@/lib/content/mdx/remark-rehype-options";
import { defaultLocale, getIntlLanguage } from "@/lib/i18n/locales";

const locale = defaultLocale;

const compileOptions: CompileOptions = {
	remarkPlugins: [
		createGitHubMarkdownPlugin(),
		createUnwrappedAutolinkLiteralsPlugin(),
		createTypographicQuotesPlugin(getIntlLanguage(locale)),
	],
	remarkRehypeOptions: createRemarkRehypeOptions(locale),
	rehypePlugins: [],
};

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
		const output = await compile(input, compileOptions);
		const module = context.createJavaScriptImport<MDXContent>(String(output));

		return {
			id: item.id,
			content: module,
		};
	},
});
