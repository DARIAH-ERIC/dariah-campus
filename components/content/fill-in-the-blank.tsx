"use client";

import { useTranslations } from "next-intl";
import { createContext, type ReactNode, use, useId, useState } from "react";

type ExerciseStatus = "idle" | "checked" | "solved";

interface FillInTheBlankContextValue {
	inputs: Array<string>;
	setInput: (id: number, value: string) => void;
	status: ExerciseStatus;
	showHints: Array<boolean>;
	toggleHint: (id: number) => void;
	caseSensitive: boolean;
}

const FillInTheBlankContext = createContext<FillInTheBlankContextValue | null>(null);

function parseAnswers(answer: string, caseSensitive: boolean): Array<string> {
	const parts = answer
		.split("/")
		.map((a) => {
			return a.trim();
		})
		.filter(Boolean);
	return caseSensitive
		? parts
		: parts.map((a) => {
				return a.toLowerCase();
			});
}

function isCorrectAnswer(input: string, answers: Array<string>, caseSensitive: boolean): boolean {
	const normalised = caseSensitive ? input.trim() : input.trim().toLowerCase();
	return answers.includes(normalised);
}

interface FillInTheBlankProps {
	/** Injected by the remark plugin — number of @@...@@ blanks in the content. */
	blankCount?: string;
	caseSensitive?: boolean;
	children: ReactNode;
}

export function FillInTheBlank(props: Readonly<FillInTheBlankProps>): ReactNode {
	const { blankCount: blankCountStr = "0", caseSensitive = false, children } = props;

	const t = useTranslations("content.FillInTheBlank");

	const count = Number(blankCountStr);

	const [inputs, setInputs] = useState<Array<string>>(() => {
		return Array.from({ length: count }, () => {
			return "";
		});
	});
	const [status, setStatus] = useState<ExerciseStatus>("idle");
	const [showHints, setShowHints] = useState<Array<boolean>>(() => {
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
		showHints,
		toggleHint(id) {
			setShowHints((prev) => {
				return prev.map((x, i) => {
					return i === id ? !x : x;
				});
			});
		},
		caseSensitive,
	};

	return (
		<FillInTheBlankContext value={ctx}>
			<div className="my-12 grid gap-y-4 rounded-md border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
				<div className="leading-loose">{children}</div>

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

					{status === "checked" ? (
						<button
							className="rounded-md bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
							onClick={() => {
								setInputs(
									Array.from({ length: count }, () => {
										return "";
									}),
								);
								setStatus("idle");
								setShowHints(
									Array.from({ length: count }, () => {
										return false;
									}),
								);
							}}
							type="button"
						>
							{t("retry")}
						</button>
					) : null}

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
	answer: string;
	hint?: string;
}

export function Blank(props: Readonly<BlankProps>): ReactNode {
	const { id: idStr, answer, hint } = props;
	const id = Number(idStr);

	const ctx = use(FillInTheBlankContext);
	const t = useTranslations("content.FillInTheBlank");
	const uId = useId();
	const inputId = `${uId}-input`;
	const hintId = `${uId}-hint`;

	/** If rendered outside a FillInTheBlank we show the first answer as a placeholder. */
	if (ctx == null) {
		return (
			<span className="border-b-2 border-dashed border-neutral-400 px-1">
				{answer.split("/")[0]}
			</span>
		);
	}

	const { inputs, setInput, status, showHints, toggleHint, caseSensitive } = ctx;

	const answers = parseAnswers(answer, caseSensitive);
	const inputValue = inputs[id] ?? "";
	const isReadOnly = status === "solved";
	const displayValue = isReadOnly ? (answers[0] ?? "") : inputValue;
	const isHintVisible = showHints[id] ?? false;
	const longestAnswer = answers.reduce((a, b) => {
		return a.length >= b.length ? a : b;
	}, "");

	let borderClass = "border-neutral-300 focus:ring-brand-500";
	if (status === "checked") {
		borderClass = isCorrectAnswer(inputValue, answers, caseSensitive)
			? "border-success-500"
			: "border-error-500";
	} else if (status === "solved") {
		borderClass = "border-brand-400";
	}

	return (
		<span className="inline-block align-baseline">
			<span className="inline-flex items-center gap-x-1">
				<input
					aria-describedby={hint != null && isHintVisible ? hintId : undefined}
					aria-label={t("blank-label", { index: String(id + 1) })}
					className={`rounded-sm border-2 px-2 py-0.5 font-mono text-sm focus:outline-none focus:ring-2 ${borderClass}`}
					id={inputId}
					onChange={(e) => {
						setInput(id, e.target.value);
					}}
					readOnly={isReadOnly}
					size={Math.max(longestAnswer.length + 2, 6)}
					type="text"
					value={displayValue}
				/>
				{hint != null ? (
					<button
						aria-controls={hintId}
						aria-expanded={isHintVisible}
						aria-label={t("hint-label")}
						className="inline-flex size-5 items-center justify-center rounded-full border border-neutral-300 text-xs text-neutral-500 hover:border-brand-400 hover:text-brand-600"
						onClick={() => {
							toggleHint(id);
						}}
						type="button"
					>
						{"?"}
					</button>
				) : null}
			</span>
			{hint != null && isHintVisible ? (
				<span className="ml-1 text-sm text-neutral-500 italic" id={hintId} role="note">
					{hint}
				</span>
			) : null}
		</span>
	);
}
