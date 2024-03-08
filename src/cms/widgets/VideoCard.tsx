import { type EditorComponentOptions } from "decap-cms-core";

import { videoProviders } from "@/cms/components/Video";
import { decodeQuotes, encodeQuotes } from "@/cms/utils/quotes";

/**
 * Decap CMS richtext editor widget for VideoCard component.
 */
export const videoCardEditorWidget: EditorComponentOptions = {
	id: "VideoCard",
	label: "VideoCard",
	fields: [
		{
			name: "provider",
			label: "Provider",
			widget: "select",
			// @ts-expect-error Missing in upstream type.
			options: Object.entries(videoProviders).map(([value, label]) => {
				return { value, label };
			}),
			default: "youtube",
		},
		{ name: "id", label: "Video ID", widget: "string" },
		{ name: "title", label: "Title", widget: "string" },
		{
			name: "subtitle",
			label: "Subtitle",
			widget: "hidden",
			// @ts-expect-error Missing in upstream type.
			default: "Click here to view",
		},
		{ name: "image", label: "Image", widget: "image" },
		{
			name: "autoPlay",
			label: "Autoplay",
			widget: "boolean",
			// @ts-expect-error Missing in upstream type.
			required: false,
		},
		{
			name: "startTime",
			label: "Start time",
			// @ts-expect-error Missing in upstream type.
			hint: "In seconds",
			widget: "number",
			required: false,
		},
	],
	pattern: /^<VideoCard([^]*?)\/>/,
	fromBlock(match) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const attrs = match[1]!;

		const provider = /provider="([^"]*)"/.exec(attrs);
		const id = /id="([^"]*)"/.exec(attrs);
		const title = /title="([^"]*)"/.exec(attrs);
		const subtitle = /subtitle="([^"]*)"/.exec(attrs);
		const image = /image="([^"]*)"/.exec(attrs);

		const autoPlay = / autoPlay /.exec(attrs);
		const startTime = /startTime="([^"]*)"/.exec(attrs);

		return {
			provider: provider ? provider[1] : undefined,
			id: id ? id[1] : undefined,
			title: title ? decodeQuotes(title[1]) : undefined,
			subtitle: subtitle ? decodeQuotes(subtitle[1]) : undefined,
			image: image ? image[1] : undefined,
			autoPlay: autoPlay ? true : undefined,
			startTime: startTime ? startTime[1] : undefined,
		};
	},
	toBlock(data) {
		let attrs = "";

		if (data.provider) attrs += ` provider="${data.provider}"`;

		if (data.id) attrs += ` id="${data.id}"`;

		if (data.title) attrs += ` title="${encodeQuotes(data.title)}"`;

		if (data.subtitle) attrs += ` subtitle="${encodeQuotes(data.subtitle)}"`;

		if (data.image) attrs += ` image="${data.image}"`;

		if (data.autoPlay) attrs += ` autoPlay`;

		if (data.startTime) attrs += ` startTime="${data.startTime}"`;

		return `<VideoCard${attrs} />`;
	},
	/**
	 * This is only used in `getWidgetFor` (which we don't use).
	 */
	toPreview() {
		return `VideoCard`;
	},
};
