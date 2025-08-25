import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "@/lib/content/keystatic/reader";
import { compile, createBaseConfig } from "@/lib/content/mdx-compiler";
import { getImageDimensions } from "@/lib/content/utils/get-image-dimensions";
import { defaultLocale } from "@/lib/i18n/locales";

const mdxConfig = createBaseConfig(defaultLocale);

export const people = createCollection({
	name: "people",
	directory: "./content/en/people/",
	include: ["*/index.mdx"],
	read(item) {
		return reader.collections["en:people"].readOrThrow(item.id, { resolveLinkedFiles: true });
	},
	async transform(data, item, context) {
		const { content, ...metadata } = data;

		const input = new VFile({ path: item.absoluteFilePath, value: content });
		const output = await compile(input, mdxConfig);
		const module = context.createJavaScriptImport<MDXContent>(String(output));
		const image = await getImageDimensions(metadata.image);

		return {
			id: item.id,
			content: module,
			metadata: {
				...metadata,
				image,
			},
		};
	},
});
