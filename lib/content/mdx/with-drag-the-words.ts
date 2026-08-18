import { valueToEstree } from "estree-util-value-to-estree";
import type { Parent, Root, Text } from "mdast";
import type { MdxJsxAttribute, MdxJsxAttributeValueExpression, MdxJsxTextElement } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

// oxlint-disable-next-line prefer-named-capture-group
const BLANK_PATTERN = /@@([^@]+)@#/g;

/**
 * Parses the inner content of a blank marker. The hint follows `::`. Examples: `Paris` → answer: "Paris", hint:
 * undefined `Paris::capital city` → answer: "Paris", hint: "capital city"
 */
function parseBlankContent(inner: string): { answer: string; hint: string | undefined } {
	const sepIdx = inner.indexOf("::");
	const answer = (sepIdx === -1 ? inner : inner.slice(0, sepIdx)).trim();
	const hint = sepIdx === -1 ? undefined : inner.slice(sepIdx + 2).trim() || undefined;
	return { answer, hint };
}

/** Creates an `mdxJsxAttributeValueExpression` for any JSON-serialisable value. */
function createValueAttribute(name: string, value: unknown): MdxJsxAttribute {
	const expression: MdxJsxAttributeValueExpression = {
		type: "mdxJsxAttributeValueExpression",
		value: JSON.stringify(value),
		data: {
			estree: {
				type: "Program",
				sourceType: "module",
				body: [{ type: "ExpressionStatement", expression: valueToEstree(value) }],
			},
		},
	};
	return { type: "mdxJsxAttribute", name, value: expression };
}

function createDropNode(answer: string, hint: string | undefined, id: number): MdxJsxTextElement {
	const attributes: Array<MdxJsxAttribute> = [
		{ type: "mdxJsxAttribute", name: "id", value: String(id) },
		{ type: "mdxJsxAttribute", name: "answer", value: answer },
	];
	if (hint !== undefined) {
		attributes.push({ type: "mdxJsxAttribute", name: "hint", value: hint });
	}
	return { type: "mdxJsxTextElement", name: "Drop", attributes, children: [] };
}

function splitTextNode(
	node: Text,
	startId: number,
): { nodes: Array<Text | MdxJsxTextElement>; nextId: number; answers: Array<string> } {
	const nodes: Array<Text | MdxJsxTextElement> = [];
	const answers: Array<string> = [];
	const { value } = node;
	let id = startId;

	BLANK_PATTERN.lastIndex = 0;
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = BLANK_PATTERN.exec(value)) !== null) {
		if (match.index > lastIndex) {
			nodes.push({ type: "text", value: value.slice(lastIndex, match.index) });
		}
		const { answer, hint } = parseBlankContent(match[1]!);
		nodes.push(createDropNode(answer, hint, id++));
		answers.push(answer);
		lastIndex = BLANK_PATTERN.lastIndex;
	}

	if (lastIndex < value.length) {
		nodes.push({ type: "text", value: value.slice(lastIndex) });
	}

	return { nodes, nextId: id, answers };
}

/**
 * Remark plugin that transforms `@@answer@@` markers inside `<QuizDragTheWords>` into `<Drop id="n" answer="..."
 * hint="..." />` JSX text elements.
 *
 * Also injects onto `<QuizDragTheWords>`:
 *
 * - `blankCount="n"` - total number of blanks
 * - `answers={["answer1","answer2"]}` - the answer for each blank, by index. Unlike the fill-in-the-blank exercise, the
 *   component needs these at the parent level to build the word bank: it renders one draggable word per blank, plus any
 *   decoys listed in the author's `distractors` attribute.
 *
 * Blank syntax:
 *
 * @@answer@@ - the word that belongs in this blank
 * @@answer::hint@@ - the same, with a hint
 *
 * Each blank takes exactly one answer. Two blanks sharing the same answer are
 * interchangeable, because a dropped word is matched by its text rather than by which
 * blank it was taken from.
 */
export const withDragTheWords: Plugin<[], Root> = function withDragTheWords() {
	return function transformer(tree, file) {
		visit(tree, "mdxJsxFlowElement", (dragTheWordsNode) => {
			if (dragTheWordsNode.name !== "QuizDragTheWords") { return; }

			let blankCount = 0;
			const allAnswers: Array<string> = [];

			visit(dragTheWordsNode as unknown as Root, "text", (textNode: Text, index, parent) => {
				if (parent == null || index == null) { return; }

				BLANK_PATTERN.lastIndex = 0;
				if (!BLANK_PATTERN.test(textNode.value)) { return; }

				const { nodes, nextId, answers } = splitTextNode(textNode, blankCount);
				blankCount = nextId;
				allAnswers.push(...answers);

				(parent as Parent).children.splice(index, 1, ...(nodes as Array<never>));
				return index + nodes.length;
			});

			if (blankCount === 0) {
				file.message("QuizDragTheWords has no blanks. Mark words with @@word@@.", dragTheWordsNode);
			}

			/**
			 * An empty answer would put an unlabelled, undraggable word in the bank, so surface it at build time rather than
			 * shipping a broken exercise.
			 */
			allAnswers.forEach((answer, id) => {
				if (answer.length === 0) {
					file.message(`QuizDragTheWords blank ${String(id + 1)} has no answer to drag.`, dragTheWordsNode);
				}
			});

			dragTheWordsNode.attributes.push(
				{ type: "mdxJsxAttribute", name: "blankCount", value: String(blankCount) },
				createValueAttribute("answers", allAnswers),
			);
		});
	};
};
