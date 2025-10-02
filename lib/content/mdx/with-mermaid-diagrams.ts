import type { Root } from "hast";
import { toString } from "hast-util-to-string";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";

interface WithMermaidDiagramsOptions {}

export const withMermaidDiagrams: Plugin<[WithMermaidDiagramsOptions], Root> =
	function withMermaidDiagrams(_options) {
		return function transformer(tree) {
			visit(tree, "element", (node, index, parent) => {
				if (index == null) return;

				if (
					parent == null ||
					parent.type !== "element" ||
					parent.tagName !== "pre" ||
					node.tagName !== "code"
				) {
					return;
				}

				const isMermaidDiagram =
					Array.isArray(node.properties.className) &&
					node.properties.className.some((className) => {
						return className === "language-mermaid";
					});

				if (!isMermaidDiagram) return;

				const diagram = toString(node);

				const component: MdxJsxFlowElement = {
					type: "mdxJsxFlowElement" as const,
					name: "MermaidDiagram",
					attributes: [
						{
							type: "mdxJsxAttribute",
							name: "diagram",
							value: {
								type: "mdxJsxAttributeValueExpression",
								value: diagram,
								data: {
									estree: {
										type: "Program",
										body: [
											{
												type: "ExpressionStatement",
												expression: {
													type: "Literal",
													value: diagram,
													raw: JSON.stringify(diagram),
												},
											},
										],
										sourceType: "module",
										comments: [],
									},
								},
							},
						},
					],
					children: [],
				};

				Object.assign(parent, component);

				return SKIP;
			});
		};
	};
