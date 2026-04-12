import { valueToEstree } from "estree-util-value-to-estree";
import type { Parent, Root, Text } from "mdast";
import type {
	MdxJsxAttribute,
	MdxJsxAttributeValueExpression,
	MdxJsxTextElement,
} from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const BLANK_PATTERN = /@@([^@]+)@@/g;

/**
 * Parses the inner content of a blank marker.
 * Answers are separated by `//`, hint follows `::`.
 * Examples:
 *   `Paris`                → answers: ["Paris"],          hint: undefined
 *   `Paris//paris`         → answers: ["Paris", "paris"], hint: undefined
 *   `Paris::capital city`  → answers: ["Paris"],          hint: "capital city"
 *   `Paris//paris::hint`   → answers: ["Paris", "paris"], hint: "hint"
 */
function parseBlankContent(inner: string): { answers: Array<string>; hint: string | undefined } {
	const sepIdx = inner.indexOf("::");
	const answerPart = sepIdx === -1 ? inner : inner.slice(0, sepIdx);
	const hint = sepIdx === -1 ? undefined : inner.slice(sepIdx + 2).trim() || undefined;
	const answers = answerPart
		.split("//")
		.map((a) => {
			return a.trim();
		})
		.filter(Boolean);
	return { answers, hint };
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

function createBlankNode(
	answers: Array<string>,
	hint: string | undefined,
	id: number,
): MdxJsxTextElement {
	const attributes: Array<MdxJsxAttribute> = [
		{ type: "mdxJsxAttribute", name: "id", value: String(id) },
		createValueAttribute("answer", answers),
	];
	if (hint !== undefined) {
		attributes.push({ type: "mdxJsxAttribute", name: "hint", value: hint });
	}
	return { type: "mdxJsxTextElement", name: "Blank", attributes, children: [] };
}

function splitTextNode(
	node: Text,
	startId: number,
): { nodes: Array<Text | MdxJsxTextElement>; nextId: number; answerGroups: Array<Array<string>> } {
	const nodes: Array<Text | MdxJsxTextElement> = [];
	const answerGroups: Array<Array<string>> = [];
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
		answerGroups.push(answers);
		lastIndex = BLANK_PATTERN.lastIndex;
	}

	if (lastIndex < value.length) {
		nodes.push({ type: "text", value: value.slice(lastIndex) });
	}

	return { nodes, nextId: id, answerGroups };
}

/**
 * Remark plugin that transforms `@@answer@@` markers inside `<FillInTheBlank>`
 * into `<Blank id={n} answer={["..."]} hint="..." />` JSX text elements.
 *
 * Also injects onto `<FillInTheBlank>`:
 *   - `blankCount={n}` - total number of blanks
 *   - `answers={[["answer1","answer2"], ["ans3"]]}` - correct answers by blank index,
 *     enabling score computation in the parent without walking children at runtime.
 *
 * Blank syntax:
 *   @@answer@@               - one accepted answer
 *   @@answer1//answer2@@           - multiple accepted answers
 *   @@answer::hint@@         - answer with a hint
 *   @@answer1//answer2::hint@@     - multiple answers with a hint
 */
export const withFillInTheBlank: Plugin<[], Root> = function withFillInTheBlank() {
	return function transformer(tree) {
		visit(tree, "mdxJsxFlowElement", (fillInTheBlankNode) => {
			if (fillInTheBlankNode.name !== "FillInTheBlank") return;

			let blankCount = 0;
			const allAnswerGroups: Array<Array<string>> = [];

			visit(fillInTheBlankNode as unknown as Root, "text", (textNode: Text, index, parent) => {
				if (parent == null || index == null) return;

				BLANK_PATTERN.lastIndex = 0;
				if (!BLANK_PATTERN.test(textNode.value)) return;

				const { nodes, nextId, answerGroups } = splitTextNode(textNode, blankCount);
				blankCount = nextId;
				allAnswerGroups.push(...answerGroups);

				(parent as Parent).children.splice(index, 1, ...(nodes as Array<never>));
				return index + nodes.length;
			});

			fillInTheBlankNode.attributes.push(
				{ type: "mdxJsxAttribute", name: "blankCount", value: String(blankCount) },
				createValueAttribute("answers", allAnswerGroups),
			);
		});
	};
};
