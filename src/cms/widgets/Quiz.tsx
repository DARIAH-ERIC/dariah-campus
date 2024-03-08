import { remarkMarkAndUnravel as withUnraveledJsxChildren } from "@mdx-js/mdx/lib/plugin/remark-mark-and-unravel.js";
import { type EditorComponentOptions } from "decap-cms-core";
import { type MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { remark } from "remark";
import withGitHubMarkdown from "remark-gfm";
import withMdx from "remark-mdx";
import { type Node } from "unist";
import { visit } from "unist-util-visit";
import { type VFile } from "vfile";

import { QuizCardStatus } from "@/cms/components/quiz/Quiz";

const allowedQuizMessageTypes = Object.values(QuizCardStatus);

function withQuizCards() {
	return transformer;

	function transformer(tree: Node, file: VFile) {
		const cards: Array<any> = [];

		(file.data as any).cards = cards;

		visit(tree, "mdxJsxFlowElement", onMdx);

		function onMdx(node: MdxJsxFlowElement) {
			switch (node.name) {
				case "Quiz.Card": {
					const card = {} as { controls?: { validate?: string } };
					const validateButtonLabel = node.attributes.find((attribute: any) => {
						return attribute.name === "validateButtonLabel";
					})?.value;
					/* @ts-expect-error Waiting for updated remark types. */
					if (validateButtonLabel != null && validateButtonLabel.length > 0) {
						card.controls = card.controls ?? {};
						/* @ts-expect-error Waiting for updated remark types. */
						card.controls.validate = validateButtonLabel;
					}
					cards.push(card);
					break;
				}
				case "Quiz.Question": {
					const last = cards[cards.length - 1];
					last.question = processor.stringify({
						type: "root",
						// @ts-expect-error Fix later.
						children: node.children,
					});
					break;
				}
				case "Quiz.Message": {
					const last = cards[cards.length - 1];
					last.messages = last.messages ?? {};
					const type = node.attributes.find((attribute: any) => {
						return attribute.name === "type";
					})?.value;
					/* @ts-expect-error Waiting for updated remark types. */
					if (type != null && allowedQuizMessageTypes.includes(type)) {
						/* @ts-expect-error Waiting for updated remark types. */
						last.messages[type] = processor.stringify({
							type: "root",
							// @ts-expect-error Fix later.
							children: node.children,
						});
					}
					break;
				}
				case "Quiz.MultipleChoice": {
					const last = cards[cards.length - 1];
					last.name = "MultipleChoice";
					last.type = "MultipleChoice";
					last.question = "";
					last.options = [];
					break;
				}
				case "Quiz.MultipleChoice.Option": {
					const last = cards[cards.length - 1];
					last.options.push({
						option: processor.stringify({
							type: "root",
							// @ts-expect-error Fix later.
							children: node.children,
						}),
						isCorrect: node.attributes.some((attribute: any) => {
							return attribute.name === "isCorrect" && attribute.value !== false;
						}),
					});
					break;
				}
				case "Quiz.XmlCodeEditor": {
					const last = cards[cards.length - 1];
					last.name = "XmlCodeEditor";
					last.type = "XmlCodeEditor";
					last.question = "";

					const codeAttribute = node.attributes.find((attribute: any) => {
						return attribute.name === "code";
					});
					const code = codeAttribute != null ? getStringLiteralAttribute(codeAttribute.value) : "";
					const solutionAttribute = node.attributes.find((attribute: any) => {
						return attribute.name === "solution";
					});
					const solution =
						solutionAttribute != null ? getStringLiteralAttribute(solutionAttribute.value) : "";

					last.code = code;
					last.solution = solution;
					last.validate = "input";
					break;
				}
				default:
			}
		}
	}
}

/** Wraps string jsx attribute in expression to preserve whitespace. */
function createStringLiteralAttribute(value: string) {
	return {
		type: "mdxJsxAttributeValueExpression",
		value: JSON.stringify(value),
		data: {
			estree: {
				type: "Program",
				sourceType: "module",
				comments: [],
				body: [
					{
						type: "ExpressionStatement",
						expression: {
							type: "Literal",
							value: value,
							raw: JSON.stringify(value),
						},
						// expression: {
						//   type: 'TemplateLiteral',
						//   expressions: [],
						//   quasis: [
						//     {
						//       type: 'TemplateElement',
						//       value: {
						//         raw: value,
						//         cooked: value,
						//       },
						//       tail: true,
						//     },
						//   ],
						// },
					},
				],
			},
		},
	};
}

function getStringLiteralAttribute(value: any) {
	if (typeof value === "string") return value;
	const expression = value.data?.estree?.body?.[0]?.expression;
	/** Template literal or regular string. */
	return expression?.quasis?.[0]?.value?.cooked ?? expression?.value;
}

const processor = remark()
	.use({
		settings: {
			bullet: "-",
			emphasis: "_",
			fences: true,
			incrementListMarker: true,
			listItemIndent: "one",
			resourceLink: true,
			rule: "-",
			strong: "*",
		},
	})
	.use(withMdx)
	.use(withUnraveledJsxChildren)
	.use(withGitHubMarkdown)
	.use(withQuizCards);

const quizQuestion = {
	name: "question",
	label: "Question",
	widget: "markdown",
	editor_components: ["image", "code-block"],
	modes: ["raw"],
};

const quizMessages = {
	name: "messages",
	label: "Messages",
	widget: "object",
	collapsed: true,
	fields: [
		{
			name: "correct",
			label: "Success",
			widget: "markdown",
			editor_components: ["image", "code-block"],
			modes: ["raw"],
		},
		{
			name: "incorrect",
			label: "Failure",
			widget: "markdown",
			editor_components: ["image", "code-block"],
			modes: ["raw"],
		},
	],
};

const quizControls = {
	name: "controls",
	label: "Controls",
	widget: "object",
	collapsed: true,
	fields: [
		{
			name: "validate",
			label: "Label for Validate button",
		},
	],
};

/**
 * Decap CMS richtext editor widget for Quiz component.
 */
export const quizEditorWidget: EditorComponentOptions = {
	id: "Quiz",
	label: "Quiz",
	fields: [
		{
			name: "cards",
			label: "Cards",
			// @ts-expect-error Missing in upstream type.
			label_singular: "Card",
			widget: "list",
			types: [
				{
					name: "MultipleChoice",
					type: "MultipleChoice",
					label: "Multiple Choice",
					widget: "object",
					fields: [
						quizQuestion,
						{
							name: "options",
							label: "Options",
							label_singular: "Option",
							widget: "list",
							min: 1,
							fields: [
								{
									name: "option",
									label: "Option",
									widget: "markdown",
									editor_components: ["image", "code-block"],
									modes: ["raw"],
								},
								{
									name: "isCorrect",
									label: "Is correct answer?",
									widget: "boolean",
								},
							],
						},
						quizMessages,
						quizControls,
					],
				},
				{
					name: "XmlCodeEditor",
					type: "XmlCodeEditor",
					label: "XML Code Editor",
					widget: "object",
					fields: [
						quizQuestion,
						{
							name: "code",
							label: "Code",
							widget: "code",
							default_language: "xml",
							allow_language_selection: false,
							output_code_only: true,
							default: "<xml></xml>",
						},
						{
							name: "solution",
							label: "Solution",
							widget: "code",
							default_language: "xml",
							allow_language_selection: false,
							output_code_only: true,
							default: "<xml></xml>",
						},
						{
							name: "validate",
							label: "Validate",
							widget: "select",
							options: [
								{ value: "input", label: "Input" },
								{ value: "selection", label: "Selection" },
							],
							default: "input",
						},
						quizMessages,
						quizControls,
					],
				},
			],
		},
	],
	pattern: /^<Quiz>\n([^]*?)\n<\/Quiz>/,
	fromBlock(match) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const children = match[1]!;
		const ast = processor.parse(children);
		const file = { data: {} };
		processor.runSync(ast, file);
		// @ts-expect-error Cards are mutated in the transformer.
		const cards = file.data.cards;

		return {
			cards,
		};
	},
	toBlock(data) {
		const cards = data.cards ?? [];

		const ast = {
			type: "root",
			children: [
				{
					type: "mdxJsxFlowElement",
					name: "Quiz",
					children: cards.map((card: any) => {
						const children: Array<any> = [];
						const attributes: Array<any> = [];

						if (card.controls?.validate != null && card.controls.validate.length > 0) {
							attributes.push({
								type: "mdxJsxAttribute",
								name: "validateButtonLabel",
								value: card.controls.validate,
							});
						}

						const quizQuestion = {
							type: "mdxJsxFlowElement",
							name: "Quiz.Question",
							children: [processor.parse(card.question)],
						};

						const messages: {
							[type in (typeof allowedQuizMessageTypes)[number]]?: string;
						} = card.messages ?? {};
						const quizMessages = Object.entries(messages).map(([type, content]) => {
							return {
								type: "mdxJsxFlowElement",
								name: `Quiz.Message`,
								children: [processor.parse(content)],
								attributes: [
									{
										type: "mdxJsxAttribute",
										name: "type",
										value: type,
									},
								],
							};
						});

						switch (card.type) {
							case "MultipleChoice": {
								children.push({
									type: "mdxJsxFlowElement",
									name: `Quiz.${card.type}`,
									children: [
										quizQuestion,
										...(card.options?.map((option: any) => {
											return {
												type: "mdxJsxFlowElement",
												name: "Quiz.MultipleChoice.Option",
												children: [processor.parse(option.option)],
												attributes:
													option.isCorrect === true
														? [
																{
																	type: "mdxJsxAttribute",
																	name: "isCorrect",
																	value: null,
																},
														  ]
														: [],
											};
										}) ?? []),
										...quizMessages,
									],
								});

								break;
							}
							case "XmlCodeEditor": {
								const attributes: Array<any> = [];

								if (card.code != null) {
									attributes.push({
										type: "mdxJsxAttribute",
										name: "code",
										value: createStringLiteralAttribute(card.code),
									});
								}
								if (card.solution != null) {
									attributes.push({
										type: "mdxJsxAttribute",
										name: "solution",
										value: createStringLiteralAttribute(card.solution),
									});
								}
								if (card.validate != null) {
									attributes.push({
										type: "mdxJsxAttribute",
										name: "validate",
										value: card.validate,
									});
								}

								children.push({
									type: "mdxJsxFlowElement",
									name: `Quiz.${card.type}`,
									attributes,
									children: [quizQuestion, ...quizMessages],
								});

								break;
							}
						}

						return {
							type: "mdxJsxFlowElement",
							name: "Quiz.Card",
							children,
							attributes,
						};
					}),
				},
			],
		};

		return String(processor.stringify(ast));
	},
	/**
	 * This is only used in `getWidgetFor` (which we don't use).
	 */
	toPreview() {
		return `Quiz`;
	},
};
