"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, createContext, use, useState } from "react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";

import { QuizControls } from "#/components/content/quiz-controls.tsx";
import { type QuizPageStatus, useQuizContext } from "#/components/content/quiz.tsx";

interface FillInTheBlankContextValue {
	inputs: Array<string>;
	setInput: (id: number, value: string) => void;
	status: QuizPageStatus;
	caseSensitive: boolean;
	validateOnBlur: boolean;
	validated: Array<boolean>;
	validateBlank: (id: number) => void;
}

const FillInTheBlankContext = createContext<FillInTheBlankContextValue | null>(null);

function isCorrectAnswer(input: string, answers: Array<string>, caseSensitive: boolean): boolean {
	const normalised = caseSensitive ? input.trim() : input.trim().toLowerCase();
	const normalisedAnswers = caseSensitive ? answers : answers.map((a) => a.toLowerCase());
	return normalisedAnswers.includes(normalised);
}

interface QuizFillInTheBlankProps {
	/** Injected by the remark plugin - correct answers per blank index. */
	answers?: Array<Array<string>>;
	/** Injected by the remark plugin - total number of blanks. */
	blankCount?: string;
	caseSensitive?: boolean;
	validateOnBlur?: boolean;
	children: ReactNode;
}

export function QuizFillInTheBlank(props: Readonly<QuizFillInTheBlankProps>): ReactNode {
	const { answers, blankCount: blankCountStr = "0", caseSensitive = false, validateOnBlur = false, children } = props;

	const t = useTranslations("content.QuizFillInTheBlank");
	const controlsT = useTranslations("content.QuizControls");
	const count = Number(blankCountStr);
	const { isCurrent, setStatus, status } = useQuizContext();

	const [inputs, setInputs] = useState<Array<string>>(() => Array.from({ length: count }, () => ""));
	const [validated, setValidated] = useState<Array<boolean>>(() => Array.from({ length: count }, () => false));

	const ctx: FillInTheBlankContextValue = {
		inputs,
		setInput(id, value) {
			setInputs((prev) => prev.map((x, i) => (i === id ? value : x)));
		},
		status,
		caseSensitive,
		validateOnBlur,
		validated,
		validateBlank(id) {
			setValidated((prev) => prev.map((x, i) => (i === id ? true : x)));
		},
	};

	const correctCount =
		(status === "correct" || status === "incorrect") && answers != null
			? inputs.filter((v, i) => isCorrectAnswer(v, answers[i] ?? [], caseSensitive)).length
			: null;

	return (
		// oxlint-disable-next-line react/jsx-no-constructed-context-values
		<FillInTheBlankContext value={ctx}>
			<section className="my-4 grid gap-y-4 rounded-md border border-neutral-200 p-6 shadow-sm" hidden={!isCurrent}>
				<div className="leading-loose">{children}</div>

				{correctCount != null ? (
					<p className="not-prose text-sm font-medium text-neutral-600">
						{t("score", { correct: String(correctCount), total: String(count) })}
					</p>
				) : null}

				<QuizControls
					nextButtonLabel={controlsT("next-question")}
					onReset={() => {
						setInputs(Array.from({ length: count }, () => ""));
						setStatus("idle");
						setValidated(Array.from({ length: count }, () => false));
					}}
					onShowSolution={
						status === "solved"
							? undefined
							: () => {
									setStatus("solved");
								}
					}
					onValidate={() => {
						const isCorrect =
							answers != null &&
							inputs.every((input, index) => isCorrectAnswer(input, answers[index] ?? [], caseSensitive));
						setStatus(isCorrect ? "correct" : "incorrect");
					}}
					previousButtonLabel={controlsT("previous-question")}
					resetButtonLabel={t("reset")}
					showSolutionButtonLabel={status === "solved" ? undefined : t("show-solution")}
					validateButtonLabel={t("check")}
				/>
			</section>
		</FillInTheBlankContext>
	);
}

interface BlankProps {
	/** Sequential zero-based index assigned by the remark plugin. */
	id: string;
	/** Accepted answers - pre-parsed array injected by the remark plugin. */
	answer: Array<string>;
	hint?: string;
}

export function Blank(props: Readonly<BlankProps>): ReactNode {
	const { id: idStr, answer, hint } = props;
	const id = Number(idStr);

	const ctx = use(FillInTheBlankContext);
	const t = useTranslations("content.QuizFillInTheBlank");

	/** When rendered outside a QuizFillInTheBlank show the first answer as a placeholder. */
	if (ctx == null) {
		return <span className="border-be-2 border-dashed border-neutral-400 px-1">{answer[0]}</span>;
	}

	const { inputs, setInput, status, caseSensitive, validateOnBlur, validated, validateBlank } = ctx;

	const inputValue = inputs[id] ?? "";
	const isReadOnly = status === "solved";
	const displayValue = isReadOnly ? (answer[0] ?? "") : inputValue;
	const longestAnswer = answer.reduce((a, b) => (a.length >= b.length ? a : b), "");

	const isValidated =
		status === "correct" ||
		status === "incorrect" ||
		status === "solved" ||
		(validateOnBlur && (validated[id] ?? false));
	const isCorrect = isCorrectAnswer(inputValue, answer, caseSensitive);

	let borderClass = "border-neutral-300 focus:ring-brand-500";
	if (isValidated && status !== "solved") {
		borderClass = isCorrect ? "border-success-500" : "border-error-500";
	} else if (status === "solved") {
		borderClass = "border-brand-400";
	}

	return (
		<span className="inline-block align-baseline">
			<span className="inline-flex items-center gap-x-1">
				<input
					aria-invalid={isValidated && status !== "solved" && !isCorrect ? true : undefined}
					aria-label={t("blank-label", { index: String(id + 1) })}
					className={`rounded-sm border-2 px-2 py-0.5 font-mono text-sm focus:ring-2 focus:outline-none ${borderClass}`}
					onBlur={
						validateOnBlur && !isReadOnly
							? () => {
									validateBlank(id);
								}
							: undefined
					}
					onChange={(e) => {
						setInput(id, e.target.value);
					}}
					readOnly={isReadOnly}
					size={Math.max(longestAnswer.length + 2, 6)}
					type="text"
					value={displayValue}
				/>
				{hint != null ? (
					<DialogTrigger>
						<Button
							aria-label={t("hint-label")}
							className="inline-flex items-center justify-center rounded-full border border-neutral-300 text-xs text-neutral-500 block-5 inline-5 hover:border-brand-400 hover:text-brand-600 pressed:border-brand-400 pressed:text-brand-600"
						>
							{"?"}
						</Button>
						<Popover
							className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 shadow-md max-inline-56"
							offset={6}
							placement="top"
						>
							<Dialog aria-label={t("hint-label")} className="outline-none">
								{hint}
							</Dialog>
						</Popover>
					</DialogTrigger>
				) : null}
			</span>
		</span>
	);
}
