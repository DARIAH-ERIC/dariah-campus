import type { Root } from "mdast";
import type { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";

export const withUnwrappedAutolinkLiterals: Plugin<[], Root> =
	function withUnwrappedAutolinkLiterals() {
		return function transformer(tree) {
			visit(tree, (node) => {
				if (
					node.type === "mdxJsxTextElement" &&
					node.name === "Link" &&
					node.children.length === 1
				) {
					const [child] = node.children;

					if (child?.type === "link") {
						node.children = child.children;

						return SKIP;
					}
				}

				return undefined;
			});
		};
	};
