import {
	typographyConfig,
	withCustomHeadingIds,
	withFootnotes,
	withIframeTitles,
	withImageSizes,
	withTableOfContents,
	withUnwrappedMdxFlowContent,
} from "@acdh-oeaw/mdx-lib";
import { compile as compileMdx, type CompileOptions } from "@mdx-js/mdx";
import withSyntaxHighlighter, { type RehypeShikiOptions } from "@shikijs/rehype";
import type { ElementContent } from "hast";
import { createTranslator } from "next-intl";
// import withMermaidDiagrams from "rehype-mermaid";
import withHeadingIds from "rehype-slug";
import withGfm from "remark-gfm";
import withTypographicQuotes from "remark-smartypants";
import type { VFile } from "vfile";

import { getIntlLanguage, type IntlLocale } from "@/lib/i18n/locales";
import messages from "@/messages/en.json";

const syntaxHighlighterConfig: RehypeShikiOptions = {
	defaultColor: "light",
	defaultLanguage: "text",
	/** Languages are lazy-loaded on demand. */
	langs: [],
	lazy: true,
	themes: {
		light: "github-light",
	},
};

type Options = Pick<
	CompileOptions,
	"baseUrl" | "recmaPlugins" | "rehypePlugins" | "remarkPlugins" | "remarkRehypeOptions"
>;

export function createBaseConfig(locale: IntlLocale): Options {
	const language = getIntlLanguage(locale);

	return {
		remarkPlugins: [withGfm, [withTypographicQuotes, typographyConfig[language]]],
		rehypePlugins: [],
	};
}

export function createFullConfig(locale: IntlLocale): Options {
	const language = getIntlLanguage(locale);
	const t = createTranslator({ locale, messages, namespace: "mdx" });

	return {
		remarkPlugins: [withGfm, withFootnotes, [withTypographicQuotes, typographyConfig[language]]],
		remarkRehypeOptions: {
			/** @see https://github.com/syntax-tree/mdast-util-to-hast/blob/13.0.0/lib/footer.js#L81 */
			footnoteBackContent(_, rereferenceIndex) {
				const result: Array<ElementContent> = [{ type: "text", value: "↩" }];

				if (rereferenceIndex > 1) {
					result.push({
						type: "element",
						tagName: "sup",
						properties: {},
						children: [{ type: "text", value: String(rereferenceIndex) }],
					});
				}

				return result;
			},
			/** @see https://github.com/syntax-tree/mdast-util-to-hast/blob/13.0.0/lib/footer.js#L108 */
			footnoteBackLabel(referenceIndex, rereferenceIndex) {
				return t("footnote-back-label", {
					reference:
						String(referenceIndex + 1) +
						(rereferenceIndex > 1 ? `-${String(rereferenceIndex)}` : ""),
				});
			},
			footnoteLabel: t("footnotes"),
			footnoteLabelProperties: { className: ["sr-only"] },
			footnoteLabelTagName: "h2",
		},
		rehypePlugins: [
			withCustomHeadingIds,
			withHeadingIds,
			[withIframeTitles, { components: ["Embed", "Video"] }],
			[withImageSizes, { components: ["Figure"] }],
			// FIXME: patch `rehype-mermaid` because of missing `import.meta.resolve` in next.js
			// [
			// 	withMermaidDiagrams,
			// 	{
			// 		mermaidConfig: { fontFamily: '"Roboto", system-ui, sans-serif' },
			// 		strategy: "inline-svg",
			// 	},
			// ],
			[withSyntaxHighlighter, syntaxHighlighterConfig],
			withTableOfContents,
			[withUnwrappedMdxFlowContent, { components: ["LinkButton"] }],
		],
	};
}

export function compile(input: VFile, options: Options): Promise<VFile> {
	return compileMdx(input, {
		format: "mdx",
		jsx: true,
		providerImportSource: "@/lib/content/mdx-components",
		...options,
	});
}
