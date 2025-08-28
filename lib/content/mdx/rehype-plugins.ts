/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
	withCustomHeadingIds,
	withIframeTitles,
	withImageSizes,
	withTableOfContents,
	withUnwrappedMdxFlowContent,
} from "@acdh-oeaw/mdx-lib";
import withSyntaxHighlighter, { type RehypeShikiOptions } from "@shikijs/rehype";
import withMermaidDiagrams from "rehype-mermaid";
import withHeadingIds from "rehype-slug";
import type { Pluggable } from "unified";

import { withRemoteImageUrls } from "@/lib/content/mdx/with-remote-image-urls";

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

export function createCustomHeadingIdsPlugin() {
	return withCustomHeadingIds satisfies Pluggable;
}

export function createHeadingIdsPlugin() {
	return withHeadingIds satisfies Pluggable;
}

export function createIframeTitlesPlugin(components?: Array<string>) {
	return [withIframeTitles, { components }] satisfies Pluggable;
}

export function createImageSizesPlugin(components?: Array<string>) {
	return [withImageSizes, { components }] satisfies Pluggable;
}

export function createRemoteImageUrlsPlugin(baseUrl: string, components?: Array<string>) {
	return [withRemoteImageUrls, { baseUrl, components }] satisfies Pluggable;
}

// FIXME: patch `rehype-mermaid` because of missing `import.meta.resolve` in next.js
export function createMermaidDiagramsPlugin() {
	return [
		withMermaidDiagrams,
		{
			mermaidConfig: { fontFamily: '"Roboto", system-ui, sans-serif' },
			strategy: "inline-svg",
		},
	] satisfies Pluggable;
}

export function createSyntaxHighlighterPlugin() {
	return [withSyntaxHighlighter, syntaxHighlighterConfig] satisfies Pluggable;
}

export function createTableOfContentsPlugin() {
	return withTableOfContents satisfies Pluggable;
}

export function createUnwrappedMdxFlowContentPlugin(components?: Array<string>) {
	return [withUnwrappedMdxFlowContent, { components }] satisfies Pluggable;
}
