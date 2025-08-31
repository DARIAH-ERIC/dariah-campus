/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { typographyConfig, withFootnotes } from "@acdh-oeaw/mdx-lib";
import withGfm from "remark-gfm";
import withTypographicQuotes from "remark-smartypants";
import type { Pluggable } from "unified";

import type { IntlLanguage } from "@/lib/i18n/locales";

export function createGitHubMarkdownPlugin() {
	return withGfm satisfies Pluggable;
}

export function createFootnotesPlugin() {
	return withFootnotes satisfies Pluggable;
}

export function createTypographicQuotesPlugin(language: IntlLanguage) {
	return [withTypographicQuotes, typographyConfig[language]] satisfies Pluggable;
}
