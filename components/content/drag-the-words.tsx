"use client";

import { useTranslations } from "next-intl";
import { type DragEvent, type ReactNode, createContext, use, useMemo, useState } from "react";
import { Button, Dialog, DialogTrigger, Menu, MenuItem, MenuTrigger, Popover, Separator } from "react-aria-components";

import { type QuizPageStatus, useQuizContext } from "#/components/content/quiz.tsx";
import { QuizControls } from "#/components/content/quiz-controls.tsx";

/**
 * Keyboard and touch users open a blank and choose from the remaining words, so focus never leaves the reading order.
 * Mouse users can additionally drag a word into a blank, using the browser's native drag and drop - it only starts from
 * a pointer gesture, so it never collides with the keyboard interaction.
 */
const dragType = "application/x-drag-the-words";

const removeAction = "__remove__";

interface Word {
	id: string;
	text: string;
}

interface DragTheWordsContextValue {
	/** Words still in the bank, deduplicated by text so a blank never offers the same word twice. */
	availableWords: Array<Word>;
	caseSensitive: boolean;
	clearBlank: (blankId: number) => void;
	instantFeedback: boolean;
	placements: Array<string | null>;
	putWord: (wordId: string, blankId: number) => void;
	status: QuizPageStatus;
	touched: Array<boolean>;
	words: Array<Word>;
}

const DragTheWordsContext = createContext<DragTheWordsContextValue | null>(null);

function isCorrectAnswer(input: string, answer: string, caseSensitive: boolean): boolean {
	if (caseSensitive) {
		return input.trim() === answer;
	}
	return input.trim().toLowerCase() === answer.toLowerCase();
}

/**
 * Stable string hash used to order the word bank. Sorting by it scrambles the words without correlating to blank order,
 * and gives the same result on the server and the client - a random shuffle would not survive hydration.
 */
function sortKey(value: string): number {
	let n = 0;
	for (let i = 0; i < value.length; i++) {
		n = (n * 31 + value.charCodeAt(i)) % 2147483647;
	}
	return n;
}

/**
 * Moves a word into `to` (a blank index), or back to the bank when `to` is `null`. Dropping onto an occupied blank
 * swaps the two words if the dragged word came from another blank, and returns the displaced word to the bank if it
 * came from the bank.
 */
function moveWord(placements: Array<string | null>, wordId: string, to: number | null): Array<string | null> {
	const next = [...placements];
	const from = next.indexOf(wordId);
	if (from !== -1) {
		next[from] = null;
	}
	if (to == null) {
		return next;
	}
	const displaced = next[to];
	next[to] = wordId;
	if (displaced != null && displaced !== wordId && from !== -1) {
		next[from] = displaced;
	}
	return next;
}

function startWordDrag(event: DragEvent<HTMLElement>, wordId: string, text: string) {
	event.dataTransfer.setData(dragType, wordId);
	event.dataTransfer.setData("text/plain", text);
	event.dataTransfer.effectAllowed = "move";
}

/** `getData` is unreadable during dragover, so the payload type is all we can check. */
function isWordDrag(event: DragEvent<HTMLElement>): boolean {
	return event.dataTransfer.types.includes(dragType);
}

interface QuizDragTheWordsProps {
	/** Injected by the remark plugin - the accepted answer per blank index. */
	answers?: Array<string>;
	/** Injected by the remark plugin - total number of blanks. */
	blankCount?: string;
	caseSensitive?: boolean;
	/**
	 * Decoy words that join the bank but fit no blank, so the exercise cannot be solved by elimination. A list from the
	 * CMS, or a comma separated string in hand-written MDX.
	 */
	distractors?: Array<string> | string;
	/** Mark each blank right or wrong as soon as a word lands in it. */
	instantFeedback?: boolean;
	children: ReactNode;
}

export function QuizDragTheWords(props: Readonly<QuizDragTheWordsProps>): ReactNode {
	const {
		answers = [],
		blankCount: blankCountStr = "0",
		caseSensitive = false,
		distractors = [],
		instantFeedback = false,
		children,
	} = props;

	const t = useTranslations("content.QuizDragTheWords");
	const controlsT = useTranslations("content.QuizControls");

	const count = Number(blankCountStr);
	const { isCurrent, setStatus, status } = useQuizContext();

	/** One word per blank, plus decoys, ordered so the two are indistinguishable. */
	const words = useMemo(() => {
		const fromBlanks = answers.map((answer, index) => {
			return { id: `word-${String(index)}`, text: answer };
		});
		const decoys = (typeof distractors === "string" ? distractors.split(",") : distractors)
			.map((word) =>
				word.trim()
			)
			.filter(Boolean)
			.map((text, index) => {
				return { id: `distractor-${String(index)}`, text };
			});
		return [...fromBlanks, ...decoys].sort((a, b) =>
			sortKey(a.text) - sortKey(b.text)
		);
	}, [answers, distractors]);

	const [placements, setPlacements] = useState<Array<string | null>>(() =>
		Array.from({ length: count }, () =>
			null
		)
	);
	const [touched, setTouched] = useState<Array<boolean>>(() =>
		Array.from({ length: count }, () =>
			false
		)
	);
	const [isBankDropTarget, setIsBankDropTarget] = useState(false);

	const isReadOnly = status === "solved";

	const bank = words.filter((word) =>
		!placements.includes(word.id)
	);

	/** Two blanks can share an answer, so the same text may sit in the bank twice. */
	const availableWords = bank.filter((word, index) =>
		(
			bank.findIndex((candidate) =>
				candidate.text === word.text
			) === index
		)
	);

	function putWord(wordId: string, blankId: number) {
		setPlacements((prev) =>
			moveWord(prev, wordId, blankId)
		);
		setTouched((prev) =>
			prev.map((wasTouched, i) =>
				i === blankId ? true : wasTouched
			)
		);
	}

	function returnWord(wordId: string) {
		setPlacements((prev) =>
			moveWord(prev, wordId, null)
		);
	}

	const ctx: DragTheWordsContextValue = {
		availableWords,
		caseSensitive,
		clearBlank(blankId) {
			setPlacements((prev) => {
				const next = [...prev];
				next[blankId] = null;
				return next;
			});
		},
		instantFeedback,
		placements,
		putWord,
		status,
		touched,
		words,
	};

	const correctCount = placements.filter((wordId, i) => {
		const word = words.find((candidate) =>
			candidate.id === wordId
		);
		return word != null && isCorrectAnswer(word.text, answers[i] ?? "", caseSensitive);
	}).length;

	function reset() {
		setPlacements(
			Array.from({ length: count }, () =>
				null
			),
		);
		setStatus("idle");
		setTouched(
			Array.from({ length: count }, () =>
				false
			),
		);
	}

	return (
		<DragTheWordsContext value={ctx}>
			<section
				className="my-4 grid gap-4 rounded-md border border-neutral-200 p-6 shadow-sm sm:grid-cols-[1fr_11rem]"
				hidden={!isCurrent}
			>
				<div className="leading-loose sm:col-start-1">{children}</div>

				<div
					className={`not-prose rounded-md border border-dashed p-3 sm:col-start-2 sm:row-start-1 sm:self-start ${
						isBankDropTarget ? "border-brand-500 bg-brand-50" : "border-neutral-300 bg-neutral-50"
					}`}
					onDragLeave={() => {
						setIsBankDropTarget(false);
					}}
					onDragOver={(event) => {
						if (!isReadOnly && isWordDrag(event)) {
							event.preventDefault();
							setIsBankDropTarget(true);
						}
					}}
					onDrop={(event) => {
						event.preventDefault();
						setIsBankDropTarget(false);
						const wordId = event.dataTransfer.getData(dragType);
						if (wordId !== "") {
							returnWord(wordId);
						}
					}}
				>
					{/*
					 * The words are not focusable. Everything they offer is reachable from each
					 * blank's menu, so making them tab stops would only lengthen the tab order.
					 * They stay readable, and draggable for mouse users.
					 *
					 * Placed words stay in the list, greyed out, so the bank keeps a fixed size
					 * instead of reflowing after every move. Used entries are hidden from
					 * assistive technology, leaving the list as the set still available.
					 */}
					<ul aria-label={t("word-bank-label")} className="flex flex-col gap-2">
						{words.map((word) => {
							const isUsed = isReadOnly || placements.includes(word.id);
							return (
								// oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
								<li
									key={word.id}
									aria-hidden={isUsed}
									className={`rounded-md border px-2 py-0.5 text-center font-mono text-sm wrap-break-word ${
										isUsed
											? "cursor-default border-neutral-200 bg-neutral-100 text-neutral-400"
											: "cursor-grab border-neutral-300 bg-white text-neutral-700"
									}`}
									draggable={!isUsed}
									onDragStart={(event) => {
										startWordDrag(event, word.id, word.text);
									}}
								>
									{word.text}
								</li>
							);
						})}
					</ul>
				</div>

				{status === "correct" || status === "incorrect" ? (
					<p className="not-prose text-sm font-medium text-neutral-600 sm:col-start-1" role="status">
						{t("score", { correct: String(correctCount), total: String(count) })}
					</p>
				) : null}

				<div className="sm:col-span-2">
					<QuizControls
						nextButtonLabel={controlsT("next-question")}
						onReset={reset}
						onShowSolution={
							status === "solved"
								? undefined
								: () => {
										setStatus("solved");
									}
						}
						onValidate={() => {
							setStatus(correctCount === count ? "correct" : "incorrect");
						}}
						previousButtonLabel={controlsT("previous-question")}
						resetButtonLabel={t("reset")}
						showSolutionButtonLabel={status === "solved" ? undefined : t("show-solution")}
						validateButtonLabel={t("check")}
					/>
				</div>
			</section>
		</DragTheWordsContext>
	);
}

interface DropProps {
	/** Sequential zero-based index assigned by the remark plugin. */
	id: string;
	/** The accepted answer, injected by the remark plugin. */
	answer: string;
	hint?: string;
}

export function Drop(props: Readonly<DropProps>): ReactNode {
	const { id: idStr, answer, hint } = props;

	const id = Number(idStr);
	const ctx = use(DragTheWordsContext);
	const t = useTranslations("content.QuizDragTheWords");

	const [isDropTarget, setIsDropTarget] = useState(false);

	/** Outside a QuizDragTheWords, or with a malformed id, fall back to showing the answer. */
	if (ctx == null || !Number.isInteger(id)) {
		return <span className="border-be-2 border-dashed border-neutral-400 px-1">{answer}</span>;
	}

	const { availableWords, caseSensitive, clearBlank, instantFeedback, placements, putWord, status, touched, words } =
		ctx;

	const isReadOnly = status === "solved";
	const placedWord = words.find((word) =>
		word.id === placements[id]
	);
	const displayText = isReadOnly ? answer : placedWord?.text;

	const isValidated =
		status === "correct" ||
		status === "incorrect" ||
		status === "solved" ||
		(instantFeedback && (touched[id] ?? false));
	const isCorrect = placedWord != null && isCorrectAnswer(placedWord.text, answer, caseSensitive);

	let stateClass = "border-neutral-300 text-neutral-400";
	if (status === "solved") {
		stateClass = "border-brand-400 text-neutral-700";
	} else if (isDropTarget) {
		stateClass = "border-brand-500 bg-brand-50 text-neutral-700";
	} else if (isValidated && placedWord != null) {
		stateClass = isCorrect ? "border-success-500 text-neutral-700" : "border-error-500 text-neutral-700";
	} else if (placedWord != null) {
		stateClass = "border-neutral-300 text-neutral-700";
	}

	return (
		<span
			className="inline-flex items-center gap-x-1 align-baseline"
			onDragLeave={() => {
				setIsDropTarget(false);
			}}
			onDragOver={(event) => {
				if (!isReadOnly && isWordDrag(event)) {
					event.preventDefault();
					setIsDropTarget(true);
				}
			}}
			onDrop={(event) => {
				event.preventDefault();
				setIsDropTarget(false);
				const wordId = event.dataTransfer.getData(dragType);
				if (!isReadOnly && wordId !== "") {
					putWord(wordId, id);
				}
			}}
		>
			<MenuTrigger>
				<Button
					aria-label={
						placedWord != null
							? t("blank-label-filled", { index: String(id + 1), word: placedWord.text })
							: t("blank-label-empty", { index: String(id + 1) })
					}
					className={`inline-flex items-center justify-center rounded-sm border-2 px-2 py-0.5 align-baseline font-mono text-sm min-block-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${stateClass}`}
					isDisabled={isReadOnly}
					style={{ minWidth: `${String(Math.max(answer.length + 2, 6))}ch` }}
				>
					{displayText ?? "\u2026"}
				</Button>
				<Popover
					className="rounded-md border border-neutral-200 bg-white py-1 shadow-md min-inline-32"
					offset={4}
					placement="bottom start"
				>
					<Menu
						aria-label={t("choose-answer-label", { index: String(id + 1) })}
						className="outline-none"
						onAction={(key) => {
							if (key === removeAction) {
								clearBlank(id);
								return;
							}
							putWord(String(key), id);
						}}
					>
						{availableWords.map((word) =>
							(
								<MenuItem
									key={word.id}
									className="cursor-pointer px-3 py-1 font-mono text-sm text-neutral-700 outline-none focus:bg-brand-50 focus:text-brand-700"
									id={word.id}
									textValue={word.text}
								>
									{word.text}
								</MenuItem>
							)
						)}
						{placedWord != null ? (
							<>
								<Separator className="my-1 border-bs border-neutral-200" />
								<MenuItem
									className="cursor-pointer px-3 py-1 text-sm text-neutral-500 outline-none focus:bg-neutral-100"
									id={removeAction}
									textValue={t("remove-word")}
								>
									{t("remove-word")}
								</MenuItem>
							</>
						) : null}
					</Menu>
				</Popover>
			</MenuTrigger>

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
	);
}
