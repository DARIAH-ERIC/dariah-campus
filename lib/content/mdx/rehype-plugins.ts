/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
	withCustomHeadingIds,
	withIframeTitles,
	withImageSizes,
	withTableOfContents,
	withUnwrappedMdxFlowContent,
} from "@acdh-oeaw/mdx-lib";
import withSyntaxHighlighter, {
	type Options as SyntaxHighlighterOptions,
} from "rehype-pretty-code";
import withHeadingIds from "rehype-slug";
import type { Pluggable } from "unified";

import { withMermaidDiagrams } from "@/lib/content/mdx/with-mermaid-diagrams";
import { withRemoteImageUrls } from "@/lib/content/mdx/with-remote-image-urls";

const syntaxHighlighterConfig: SyntaxHighlighterOptions = {
	bypassInlineCode: true,
	defaultLang: "plaintext",
	theme: "github-light",
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

export function createMermaidDiagramsPlugin() {
	return withMermaidDiagrams satisfies Pluggable;
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
