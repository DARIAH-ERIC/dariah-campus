"use client";

import { useTranslations } from "next-intl";
import { createContext, type ReactNode, use, useState } from "react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";

type ExerciseStatus = "idle" | "checked" | "solved";

interface FillInTheBlankContextValue {
	inputs: Array<string>;
	setInput: (id: number, value: string) => void;
	status: ExerciseStatus;
	caseSensitive: boolean;
	validateOnBlur: boolean;
	validated: Array<boolean>;
	validateBlank: (id: number) => void;
}

const FillInTheBlankContext = createContext<FillInTheBlankContextValue | null>(null);

function isCorrectAnswer(input: string, answers: Array<string>, caseSensitive: boolean): boolean {
	const normalised = caseSensitive ? input.trim() : input.trim().toLowerCase();
	const normalisedAnswers = caseSensitive
		? answers
		: answers.map((a) => {
				return a.toLowerCase();
			});
	return normalisedAnswers.includes(normalised);
}

interface FillInTheBlankProps {
	/** Injected by the remark plugin - correct answers per blank index. */
	answers?: Array<Array<string>>;
	/** Injected by the remark plugin - total number of blanks. */
	blankCount?: string;
	caseSensitive?: boolean;
	validateOnBlur?: boolean;
	children: ReactNode;
}

export function FillInTheBlank(props: Readonly<FillInTheBlankProps>): ReactNode {
	const {
		answers,
		blankCount: blankCountStr = "0",
		caseSensitive = false,
		validateOnBlur = false,
		children,
	} = props;

	const t = useTranslations("content.FillInTheBlank");
	const count = Number(blankCountStr);

	const [inputs, setInputs] = useState<Array<string>>(() => {
		return Array.from({ length: count }, () => {
			return "";
		});
	});
	const [status, setStatus] = useState<ExerciseStatus>("idle");
	const [validated, setValidated] = useState<Array<boolean>>(() => {
		return Array.from({ length: count }, () => {
			return false;
		});
	});

	// eslint-disable-next-line @eslint-react/no-unstable-context-value
	const ctx: FillInTheBlankContextValue = {
		inputs,
		setInput(id, value) {
			setInputs((prev) => {
				return prev.map((x, i) => {
					return i === id ? value : x;
				});
			});
		},
		status,
		caseSensitive,
		validateOnBlur,
		validated,
		validateBlank(id) {
			setValidated((prev) => {
				return prev.map((x, i) => {
					return i === id ? true : x;
				});
			});
		},
	};

	const correctCount =
		status === "checked" && answers != null
			? inputs.filter((v, i) => {
					return isCorrectAnswer(v, answers[i] ?? [], caseSensitive);
				}).length
			: null;

	return (
		<FillInTheBlankContext value={ctx}>
			<div className="my-12 grid gap-y-4 rounded-md border border-neutral-200 p-6 shadow-sm">
				<div className="leading-loose">{children}</div>

				{correctCount != null ? (
					<p className="not-prose text-sm font-medium text-neutral-600">
						{t("score", { correct: String(correctCount), total: String(count) })}
					</p>
				) : null}

				<div className="flex flex-wrap gap-2">
					{status === "idle" ? (
						<button
							className="rounded-md bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
							onClick={() => {
								setStatus("checked");
							}}
							type="button"
						>
							{t("check")}
						</button>
					) : null}

					<button
						className="rounded-md border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
						onClick={() => {
							setInputs(
								Array.from({ length: count }, () => {
									return "";
								}),
							);
							setStatus("idle");
							setValidated(
								Array.from({ length: count }, () => {
									return false;
								}),
							);
						}}
						type="button"
					>
						{t("reset")}
					</button>

					{status !== "solved" ? (
						<button
							className="rounded-md border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
							onClick={() => {
								setStatus("solved");
							}}
							type="button"
						>
							{t("show-solution")}
						</button>
					) : null}
				</div>
			</div>
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
	const t = useTranslations("content.FillInTheBlank");

	/** When rendered outside a FillInTheBlank show the first answer as a placeholder. */
	if (ctx == null) {
		return <span className="border-b-2 border-dashed border-neutral-400 px-1">{answer[0]}</span>;
	}

	const { inputs, setInput, status, caseSensitive, validateOnBlur, validated, validateBlank } = ctx;

	const inputValue = inputs[id] ?? "";
	const isReadOnly = status === "solved";
	const displayValue = isReadOnly ? (answer[0] ?? "") : inputValue;
	const longestAnswer = answer.reduce((a, b) => {
		return a.length >= b.length ? a : b;
	}, "");

	const isValidated =
		status === "checked" || status === "solved" || (validateOnBlur && (validated[id] ?? false));
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
					className={`rounded-sm border-2 px-2 py-0.5 font-mono text-sm focus:outline-none focus:ring-2 ${borderClass}`}
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
							className="inline-flex size-5 items-center justify-center rounded-full border border-neutral-300 text-xs text-neutral-500 hover:border-brand-400 hover:text-brand-600 pressed:border-brand-400 pressed:text-brand-600"
						>
							{"?"}
						</Button>
						<Popover
							className="max-w-56 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 shadow-md"
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
