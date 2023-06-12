import type * as Hast from "hast";
import sizeOf from "image-size";
import { type MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { type Transformer } from "unified";
import { visit } from "unist-util-visit";
import { type VFile } from "vfile";

import { copyAsset } from "@/mdx/utils/copyAsset";
import { generateBlurDataUrl } from "@/mdx/utils/generateBlurDataUrl";

/**
 * Rehype plugin which copies linked image assets, and adds width and height.
 */
export default function attacher(): Transformer {
	return transformer;

	async function transformer(tree: Hast.Node, file: VFile) {
		const imageBlurPromises: Array<Promise<void>> = [];

		visit(tree, "mdxJsxFlowElement", visitor);

		await Promise.all(imageBlurPromises);

		function visitor(node: MdxJsxFlowElement) {
			if (node.name !== "Figure") return;

			const srcAttribute = node.attributes.find((attribute) => {
				return "name" in attribute && attribute.name === "src";
			});
			const src = srcAttribute?.value;
			if (srcAttribute == null || src == null) {
				throw new Error("Missing `src` attribute on `Figure` element.");
			}
			const paths = copyAsset(src, file.path);
			if (paths == null) return;
			const { publicPath, srcFilePath } = paths;

			srcAttribute.value = publicPath;

			/** When the image does not exist this will throw. */
			const dimensions = sizeOf(srcFilePath);

			node.attributes.push({
				type: "mdxJsxAttribute",
				name: "width",
				value: {
					type: "mdxJsxAttributeValueExpression",
					value: String(dimensions.width),
					data: {
						estree: {
							type: "Program",
							body: [
								{
									type: "ExpressionStatement",
									expression: {
										type: "Literal",
										value: dimensions.width as any,
										raw: String(dimensions.width),
									},
								},
							],
							sourceType: "module",
							comments: [],
						},
					},
				},
			});
			node.attributes.push({
				type: "mdxJsxAttribute",
				name: "height",
				value: {
					type: "mdxJsxAttributeValueExpression",
					value: String(dimensions.height),
					data: {
						estree: {
							type: "Program",
							body: [
								{
									type: "ExpressionStatement",
									expression: {
										type: "Literal",
										value: dimensions.height as any,
										raw: String(dimensions.height),
									},
								},
							],
							sourceType: "module",
							comments: [],
						},
					},
				},
			});

			imageBlurPromises.push(
				generateBlurDataUrl(srcFilePath).then((dataUrl) => {
					node.attributes.push({
						type: "mdxJsxAttribute",
						name: "blurDataURL",
						value: dataUrl,
					});
					node.attributes.push({
						type: "mdxJsxAttribute",
						name: "placeholder",
						value: "blur",
					});
				}),
			);
		}
	}
}
