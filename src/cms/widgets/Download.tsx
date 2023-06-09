import { type EditorComponentOptions } from "netlify-cms-core";

import { decodeQuotes, encodeQuotes } from "@/cms/utils/quotes";

/**
 * Netlify CMS richtext editor widget for Download component.
 */
export const downloadWidget: EditorComponentOptions = {
	id: "Download",
	label: "Download",
	fields: [
		{
			name: "url",
			label: "Document",
			widget: "file",
			// FIXME: https://github.com/netlify/netlify-cms/issues/5514
			// @ts-expect-error Missing in upstream types.
			media_folder: "downloads",
			public_folder: "downloads",
		},
		{ name: "title", label: "Title", widget: "string" },
	],
	pattern: /^<Download(.*?)\/>/,
	fromBlock(match) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const attrs = match[1]!;

		const url = /url="([^"]*)"/.exec(attrs);
		const title = /title="([^"]*)"/.exec(attrs);

		return {
			url: url ? url[1] : undefined,
			title: title ? decodeQuotes(title[1]) : undefined,
		};
	},
	toBlock(data) {
		let attrs = "";

		if (data.url) attrs += ` url="${data.url}"`;

		if (data.title) attrs += ` title="${encodeQuotes(data.title)}"`;

		return `<Download${attrs} />`;
	},
	/**
	 * This is only used in `getWidgetFor` (which we don't use).
	 */
	toPreview() {
		return `Download`;
	},
};
