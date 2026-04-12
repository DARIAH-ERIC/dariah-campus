import type { Parent, Root, Text } from "mdast";
import type { MdxJsxAttribute, MdxJsxTextElement } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const BLANK_PATTERN = /@@([^@]+)@@/g;

/**
 * Parses a blank marker's inner content into answer(s) and an optional hint.
 * Syntax: `answer`, `answer1/answer2`, `answer::hint`, `answer1/answer2::hint`
 * The double-colon `::` separates the hint.
 */
function parseBlankContent(inner: string): { answers: string; hint: string | undefined } {
	const sepIdx = inner.indexOf("::");
	if (sepIdx === -1) {
		return { answers: inner.trim(), hint: undefined };
	}
	return {
		answers: inner.slice(0, sepIdx).trim(),
		hint: inner.slice(sepIdx + 2).trim() || undefined,
	};
}

function createBlankNode(answers: string, hint: string | undefined, id: number): MdxJsxTextElement {
	const attributes: Array<MdxJsxAttribute> = [
		{ type: "mdxJsxAttribute", name: "id", value: String(id) },
		{ type: "mdxJsxAttribute", name: "answer", value: answers },
	];

	if (hint !== undefined) {
		attributes.push({ type: "mdxJsxAttribute", name: "hint", value: hint });
	}

	return {
		type: "mdxJsxTextElement",
		name: "Blank",
		attributes,
		children: [],
	};
}

/**
 * Splits a text node containing `@@...@@` markers into text nodes and
 * `<Blank id={n} answer="..." hint="..." />` JSX text elements.
 * Returns the nodes and the updated blank counter.
 */
function splitTextNode(
	node: Text,
	startId: number,
): { nodes: Array<Text | MdxJsxTextElement>; nextId: number } {
	const nodes: Array<Text | MdxJsxTextElement> = [];
	const { value } = node;
	let id = startId;

	BLANK_PATTERN.lastIndex = 0;
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = BLANK_PATTERN.exec(value)) !== null) {
		if (match.index > lastIndex) {
			nodes.push({ type: "text", value: value.slice(lastIndex, match.index) });
		}

		const { answers, hint } = parseBlankContent(match[1]!);
		nodes.push(createBlankNode(answers, hint, id++));
		lastIndex = BLANK_PATTERN.lastIndex;
	}

	if (lastIndex < value.length) {
		nodes.push({ type: "text", value: value.slice(lastIndex) });
	}

	return { nodes, nextId: id };
}

/**
 * Remark plugin that transforms `@@answer@@` markers inside `<FillInTheBlank>`
 * into `<Blank id={n} answer="..." hint="..." />` JSX text elements.
 * Also injects a `blankCount` attribute onto each `FillInTheBlank` node so the
 * runtime component can initialise its state without walking the child tree.
 *
 * Syntax:
 *   @@answer@@                — one accepted answer
 *   @@answer1/answer2@@       — multiple accepted answers
 *   @@answer::hint@@          — answer with a hint
 *   @@answer1/answer2::hint@@ — multiple answers with a hint
 */
export const withFillInTheBlank: Plugin<[], Root> = function remarkFillInTheBlank() {
	return function transformer(tree) {
		visit(tree, "mdxJsxFlowElement", (fillInTheBlankNode) => {
			if (fillInTheBlankNode.name !== "FillInTheBlank") return;

			let blankCount = 0;

			visit(fillInTheBlankNode as unknown as Root, "text", (textNode: Text, index, parent) => {
				if (parent == null || index == null) return;

				BLANK_PATTERN.lastIndex = 0;
				if (!BLANK_PATTERN.test(textNode.value)) return;

				const { nodes, nextId } = splitTextNode(textNode, blankCount);
				blankCount = nextId;

				(parent as Parent).children.splice(index, 1, ...(nodes as Array<never>));
				return index + nodes.length;
			});

			fillInTheBlankNode.attributes.push({
				type: "mdxJsxAttribute",
				name: "blankCount",
				value: String(blankCount),
			});
		});
	};
};
