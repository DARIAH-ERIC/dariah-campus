import { relative, resolve } from "node:path";

import { assert, removeTrailingSlash } from "@acdh-oeaw/lib";
import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface WithRemoteImageUrlsOptions {
	baseUrl: string;
	/** @default ["Figure"] */
	components?: Array<string>;
}

export const withRemoteImageUrls: Plugin<[WithRemoteImageUrlsOptions], Root> = function withRemoteImageUrls(options) {
	const baseUrl = removeTrailingSlash(options.baseUrl);
	const { components = ["Figure"] } = options;

	return function transformer(tree, vfile) {
		function getImagePath(src: unknown): string | null {
			if (typeof src !== "string") {
				return null;
			}

			if (src.startsWith("/")) {
				return `${baseUrl}/public${src}`;
			}

			if (src.startsWith("./") || src.startsWith("../")) {
				const basePath = vfile.dirname;
				assert(basePath);

				return `${baseUrl}/${relative(process.cwd(), resolve(basePath, src))}`;
			}

			return null;
		}

		visit(tree, (node, index, parent) => {
			if (parent == null) {
				return;
			}
			if (index == null) {
				return;
			}

			if (node.type === "element" && node.tagName === "img") {
				const path = getImagePath(node.properties.src);
				if (path == null) {
					return;
				}
				node.properties.src = path;
			} else if (node.type === "mdxJsxFlowElement" && node.name != null && components.includes(node.name)) {
				const imageAttributes = node.name === "ImageComparisonSlider" ? ["left", "right"] : ["src"];
				for (const attribute of node.attributes) {
					if (attribute.type !== "mdxJsxAttribute" || !imageAttributes.includes(attribute.name)) {
						continue;
					}
					const path = getImagePath(attribute.value);
					if (path != null) {
						attribute.value = path;
					}
				}
			}
		});
	};
};
