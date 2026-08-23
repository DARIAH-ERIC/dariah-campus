import { valueToEstree } from "estree-util-value-to-estree";
import type { Element, ElementContent, Root, RootContent } from "hast";
import { toString } from "hast-util-to-string";
import type { MdxJsxFlowElementHast } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface ContentSection {
	/** Identifier used as `?section=` search parameter value. */
	id: string;
	/** Text content of the first heading in the section, used to label navigation controls. */
	label: string | null;
	/** Identifiers of all headings in the section, used to link table of contents entries across sections. */
	headingIds: Array<string>;
}

declare module "vfile" {
	interface DataMap {
		sections: Array<ContentSection>;
	}
}

const headingTagNames = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

interface Group {
	id: string | null;
	children: Array<RootContent>;
}

function isSplitPoint(node: RootContent, component: string): node is MdxJsxFlowElementHast {
	return node.type === "mdxJsxFlowElement" && node.name === component;
}

function isBlank(node: RootContent): boolean {
	return node.type === "text" && node.value.trim().length === 0;
}

function getAttributeValue(node: MdxJsxFlowElementHast, name: string): string | null {
	const attribute = node.attributes.find(
		(attribute) => attribute.type === "mdxJsxAttribute" && attribute.name === name,
	);

	return typeof attribute?.value === "string" && attribute.value.length > 0 ? attribute.value : null;
}

/** Appends a numeric suffix until the identifier is unique. */
function createUniqueId(id: string, usedIds: Set<string>): string {
	if (!usedIds.has(id)) {
		return id;
	}

	let suffix = 2;

	while (usedIds.has(`${id}-${String(suffix)}`)) {
		suffix++;
	}

	return `${id}-${String(suffix)}`;
}

function getLabelAndHeadingIds(children: Array<RootContent>): Pick<ContentSection, "headingIds" | "label"> {
	const headingIds: Array<string> = [];
	let label: string | null = null;

	children.forEach((child) => {
		visit(child, "element", (element: Element) => {
			if (!headingTagNames.has(element.tagName)) {
				return;
			}

			label ??= toString(element);

			if (typeof element.properties.id === "string" && element.properties.id.length > 0) {
				headingIds.push(element.properties.id);
			}
		});
	});

	return { headingIds, label };
}

function createSectionsExport(sections: Array<ContentSection>, identifier: string): RootContent {
	const node = {
		type: "mdxjsEsm",
		value: `export const ${identifier} = ${JSON.stringify(sections)};`,
		data: {
			estree: {
				type: "Program",
				sourceType: "module",
				body: [
					{
						type: "ExportNamedDeclaration",
						source: null,
						specifiers: [],
						attributes: [],
						declaration: {
							type: "VariableDeclaration",
							kind: "const",
							declarations: [
								{
									type: "VariableDeclarator",
									id: { type: "Identifier", name: identifier },
									init: valueToEstree(sections),
								},
							],
						},
					},
				],
			},
		},
	};

	/** `mdxjsEsm` is a valid root child in mdx documents, but not part of the hast type definitions. */
	return node as unknown as RootContent;
}

export interface WithContentSectionsOptions {
	/** @default "ContentSection" */
	component?: string;
	/** @default "sections" */
	identifier?: string;
	/** @default "SplitPoint" */
	splitPoint?: string;
}

/**
 * Splits a document into sections at top-level `<SplitPoint id="..." />` elements, and wraps each section in a
 * `<ContentSection id="...">` element, so consumers can render one section at a time.
 *
 * Content preceding the first split point becomes the first section, and receives a generated identifier. Authors can
 * name that section by putting a split point at the very start of the document instead.
 *
 * The resulting sections - their identifiers, labels, and the headings they contain - are provided both as
 * `file.data.sections` and as a named `sections` export on the compiled module.
 *
 * Note that this must run _after_ headings have been assigned identifiers, and _before_ the table of contents plugin,
 * so the table of contents covers the whole document, not just a single section.
 */
export const withContentSections: Plugin<[WithContentSectionsOptions?], Root> = function withContentSections(
	options = {},
) {
	const { component = "ContentSection", identifier = "sections", splitPoint = "SplitPoint" } = options;

	return function transformer(tree, file) {
		/** Split points which are not top-level cannot split the document, so they are dropped with a warning. */
		visit(tree, "mdxJsxFlowElement", (node, index, parent) => {
			if (parent == null || index == null || parent === tree || node.name !== splitPoint) {
				return;
			}

			file.message(`Ignoring <${splitPoint}> which is not a top-level element.`, node);

			parent.children.splice(index, 1);

			return index;
		});

		const groups: Array<Group> = [{ id: null, children: [] }];
		const hoisted: Array<RootContent> = [];

		for (const child of tree.children) {
			if (child.type === "mdxjsEsm") {
				hoisted.push(child);
			} else if (!isSplitPoint(child, splitPoint)) {
				groups.at(-1)!.children.push(child);
			} else {
				const id = getAttributeValue(child, "id");

				if (id == null) {
					file.message(`Ignoring <${splitPoint}> without "id" attribute.`, child);
				} else {
					groups.push({ id, children: [] });
				}
			}
		}

		/** Nothing to do when the document does not contain any valid split point. */
		if (groups.length === 1) {
			file.data.sections = [];
			tree.children.unshift(createSectionsExport([], identifier));
			return;
		}

		/** Whitespace-only content before the first split point does not constitute a section. */
		if (groups[0]!.id == null && groups[0]!.children.every(isBlank)) {
			groups.shift();
		}

		const usedIds = new Set<string>();
		const sections: Array<ContentSection> = [];
		const children: Array<RootContent> = [...hoisted];

		groups.forEach((group, index) => {
			const id = createUniqueId(group.id ?? `section-${String(index + 1)}`, usedIds);

			if (group.id != null && group.id !== id) {
				file.message(`Duplicate <${splitPoint}> identifier "${group.id}", using "${id}" instead.`);
			}

			usedIds.add(id);

			sections.push({ id, ...getLabelAndHeadingIds(group.children) });

			children.push({
				type: "mdxJsxFlowElement",
				name: component,
				attributes: [{ type: "mdxJsxAttribute", name: "id", value: id }],
				children: group.children as Array<ElementContent>,
			});
		});

		tree.children = children;

		file.data.sections = sections;
		tree.children.unshift(createSectionsExport(sections, identifier));
	};
};
