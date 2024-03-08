import { type EditorComponentOptions } from "decap-cms-core";

import { decodeQuotes, encodeQuotes } from "@/cms/utils/quotes";

/**
 * Decap CMS richtext editor widget for Figure component.
 */
export const figureEditorWidget: EditorComponentOptions = {
	id: "Figure",
	label: "Figure",
	fields: [
		{
			name: "src",
			label: "Image",
			widget: "image",
		},
		{ name: "alt", label: "Image description (alt text)", widget: "string" },
		{
			name: "children",
			label: "Caption",
			widget: "markdown",
			/* @ts-expect-error Missing in upstream types. */
			editor_components: [],
			// modes: ['raw'],
		},
	],
	pattern: /^<Figure(.*?)>\n([^]*?)\n<\/Figure>/,
	fromBlock(match) {
		/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
		const attrs = match[1]!;

		const src = /src="([^"]*)"/.exec(attrs);
		const alt = /alt="([^"]*)"/.exec(attrs);

		return {
			src: src ? src[1] : undefined,
			alt: alt ? decodeQuotes(alt[1]) : undefined,
			children: match[2],
		};
	},
	toBlock(data) {
		let attrs = "";

		if (data.src) attrs += ` src="${data.src}"`;

		if (data.alt) attrs += ` alt="${encodeQuotes(data.alt)}"`;

		return `<Figure${attrs}>
${data.children ?? ""}
</Figure>`;
	},
	/**
	 * This is only used in `getWidgetFor` (which we don't use).
	 */
	toPreview() {
		return `Figure`;
	},
};
