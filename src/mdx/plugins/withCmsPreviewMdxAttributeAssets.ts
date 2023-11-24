import { type PreviewTemplateComponentProps } from "decap-cms-core";
import type * as Hast from "hast";
import { type MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { type Transformer } from "unified";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin which resolves relative image file paths on an mdx element's
 * `image` attribute to `blob:` urls, so they can be used in the CMS preview.
 * Note that this does not add `width` and `height`.
 */
export default function attacher(getAsset: PreviewTemplateComponentProps["getAsset"]): Transformer {
	return transformer;

	function transformer(tree: Hast.Node) {
		visit(tree, "mdxJsxFlowElement", onMdxFlowElement);

		function onMdxFlowElement(node: MdxJsxFlowElement) {
			const attribute = node.attributes.find((attribute) => {
				return "name" in attribute && attribute.name === "image";
			});
			if (attribute == null) return;

			const src = attribute.value;
			if (typeof src !== "string") return;

			attribute.value = String(getAsset(src));
		}
	}
}
