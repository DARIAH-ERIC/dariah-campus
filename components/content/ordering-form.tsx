"use client";

import cn from "clsx/lite";
import { CircleCheckIcon, CircleXIcon, GripVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type DragEvent, type ReactNode, useState } from "react";
import { Button, MenuTrigger } from "react-aria-components";

import { QuizControls } from "#/components/content/quiz-controls.tsx";
import { QuizExplanations } from "#/components/content/quiz-explanations.tsx";
import { PositionMenu, moveTo } from "#/components/content/quiz-positions.tsx";
import { useQuizContext } from "#/components/content/quiz.tsx";

/**
 * Keyboard and touch users open an item and pick its position from a menu - see `PositionMenu`. Dragging is the
 * enhancement on top of that.
 *
 * A press only starts a native drag when it lands on an element react-aria is not handling presses for, which is why an
 * item carries a separate grip - the card itself has to stay a react-aria button to open the menu.
 */
const dragType = "application/x-quiz-ordering";

export interface OrderingItem {
	/** Revealed once the exercise has been answered, so it explains the item without giving its place away. */
	explanation?: ReactNode;
	id: string;
	label: string;
}

function startItemDrag(event: DragEvent<HTMLElement>, itemIndex: number, label: string) {
	event.dataTransfer.setData(dragType, String(itemIndex));
	event.dataTransfer.setData("text/plain", label);
	event.dataTransfer.effectAllowed = "move";
}

/** `getData` is unreadable during dragover, so the payload type is all we can check. */
function isItemDrag(event: DragEvent<HTMLElement>): boolean {
	return event.dataTransfer.types.includes(dragType);
}

interface QuizOrderingFormProps {
	/** Item indices in the order the user starts from, which is a scramble of the solution. */
	initialOrder: Array<number>;
	/** Mark each item as in or out of place as soon as it is moved. */
	instantFeedback: boolean;
	/** In the order they were authored, which is the solution. */
	items: Array<OrderingItem>;
	/** What the exercise asks for, authored as content so it can carry links and emphasis. */
	question?: ReactNode;
}

/**
 * The interactive half of `QuizOrdering`. Collecting the items out of the children happens in the server component, so
 * components can be identified by comparing `child.type`.
 */
export function QuizOrderingForm(props: Readonly<QuizOrderingFormProps>): ReactNode {
	const { initialOrder, instantFeedback, items, question } = props;

	const t = useTranslations("content.QuizOrdering");
	const controlsT = useTranslations("content.QuizControls");

	const { isCurrent, setStatus, status } = useQuizContext();

	/** The item at each position, by item index. An item is in place when its index equals its position. */
	const [order, setOrder] = useState(initialOrder);
	const [dropTargetPosition, setDropTargetPosition] = useState<number | null>(null);
	/**
	 * Every item has a position from the start, so instant feedback waits for the first move - marking the initial
	 * scramble would tell the user which items already sit in place before they have done anything.
	 */
	const [hasMoved, setHasMoved] = useState(false);
	/**
	 * A moved card keeps its control, so focus stays on it - but a change to its accessible name is not announced, so the
	 * move is reported through a live region instead.
	 */
	const [announcement, setAnnouncement] = useState<string | null>(null);

	const isReadOnly = status === "solved";
	const isValidated = status === "correct" || status === "incorrect";
	/** In the solved state every item sits where it belongs, so marking each one adds nothing. */
	const isMarked = !isReadOnly && (isValidated || (instantFeedback && hasMoved));

	const total = items.length;
	const correctCount = order.filter((itemIndex, position) => itemIndex === position).length;

	function move(itemIndex: number, position: number) {
		setOrder((order) => moveTo(order, itemIndex, position));
		setHasMoved(true);
		setAnnouncement(
			t("moved", { item: items[itemIndex]!.label, position: String(position + 1), total: String(total) }),
		);
	}

	function drop(event: DragEvent<HTMLElement>, position: number) {
		event.preventDefault();
		setDropTargetPosition(null);

		/** A drag which carries no payload of ours is not ours to handle - an empty string would read as item zero. */
		const data = event.dataTransfer.getData(dragType);
		if (isReadOnly || data === "") {
			return;
		}

		const itemIndex = Number(data);
		if (!Number.isInteger(itemIndex) || items[itemIndex] == null) {
			return;
		}

		move(itemIndex, position);
	}

	function reset() {
		setOrder(initialOrder);
		setHasMoved(false);
		setAnnouncement(null);
		setStatus("idle");
	}

	function showSolution() {
		setOrder(items.map((_, index) => index));
		setAnnouncement(null);
		setStatus("solved");
	}

	function renderItem(itemIndex: number, position: number): ReactNode {
		const item = items[itemIndex]!;
		const isCorrect = itemIndex === position;
		const isDropTarget = dropTargetPosition === position;
		const values = { item: item.label, position: String(position + 1), total: String(total) };

		let label = t("item-label", values);
		if (isReadOnly) {
			label = t("solution-item-label", values);
		} else if (isMarked) {
			label = isCorrect ? t("item-label-correct", values) : t("item-label-incorrect", values);
		}

		return (
			// oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Mouse convenience; the item itself is a menu button.
			<li
				key={item.id}
				className={cn(
					"flex items-center gap-x-2 rounded-md border p-2 transition",
					isDropTarget ? "border-brand-500 bg-brand-50" : undefined,
					!isDropTarget && isMarked && !isCorrect ? "border-error-500 bg-error-50" : undefined,
					!isDropTarget && isMarked && isCorrect ? "border-success-500 bg-success-50" : undefined,
					!isDropTarget && !isMarked ? "border-neutral-300 bg-white" : undefined,
				)}
				draggable={!isReadOnly}
				onDragLeave={() => {
					setDropTargetPosition((current) => (current === position ? null : current));
				}}
				onDragOver={(event) => {
					if (!isReadOnly && isItemDrag(event)) {
						event.preventDefault();
						setDropTargetPosition(position);
					}
				}}
				onDragStart={(event) => {
					startItemDrag(event, itemIndex, item.label);
				}}
				onDrop={(event) => {
					drop(event, position);
				}}
			>
				{/* Pointer-only, and duplicated by the menu, so it is not offered to assistive technology. */}
				{isReadOnly ? null : (
					<span aria-hidden={true} className="inline-flex shrink-0 cursor-grab text-neutral-400">
						<GripVerticalIcon className="block-4 inline-4" />
					</span>
				)}

				{/* The visible position; the accessible name carries it too, so the number itself is decoration. */}
				<span
					aria-hidden={true}
					className={cn(
						"inline-flex shrink-0 items-center justify-center rounded-xs px-1 text-xs font-medium tabular-nums min-inline-5",
						isMarked && !isCorrect ? "bg-error-100 text-error-800" : undefined,
						isMarked && isCorrect ? "bg-success-100 text-success-800" : undefined,
						isMarked ? undefined : "bg-neutral-100 text-neutral-500",
					)}
				>
					{position + 1}
				</span>

				<MenuTrigger>
					<Button
						aria-label={label}
						className={cn(
							"flex-1 rounded-sm px-2 py-1 text-start text-sm text-neutral-700 outline-none min-inline-0 focus-visible:ring-2 focus-visible:ring-brand-500",
							isReadOnly ? undefined : "cursor-grab hover:bg-neutral-100",
						)}
						isDisabled={isReadOnly}
					>
						{item.label}
					</Button>
					<PositionMenu
						current={position}
						label={(position) => t("position-label", { position: String(position) })}
						onMove={(position) => {
							move(itemIndex, position);
						}}
						total={total}
					/>
				</MenuTrigger>

				{isMarked ? (
					isCorrect ? (
						<CircleCheckIcon aria-hidden={true} className="shrink-0 text-success-600 block-4 inline-4" />
					) : (
						<CircleXIcon aria-hidden={true} className="shrink-0 text-error-600 block-4 inline-4" />
					)
				) : null}
			</li>
		);
	}

	return (
		<section
			className="my-4 grid gap-4 rounded-md border border-neutral-200 bg-white px-4 py-6 text-sm/relaxed text-neutral-950 shadow-sm"
			hidden={!isCurrent}
		>
			{/* Outside `not-prose`, so the links and emphasis an author reaches for still render. */}
			{question != null ? <header className="border-be border-neutral-200 pbe-4 text-base">{question}</header> : null}

			<div className="not-prose grid gap-y-4">
				<ol aria-label={t("items-label")} className="grid gap-y-2">
					{order.map((itemIndex, position) => renderItem(itemIndex, position))}
				</ol>
			</div>

			{/* Always in the document, so the live region exists before the first move it has to announce. */}
			<p className="sr-only" role="status">
				{announcement}
			</p>

			{isValidated ? (
				<p className="not-prose text-sm font-medium text-neutral-600" role="status">
					{t("score", { correct: String(correctCount), total: String(total) })}
				</p>
			) : null}

			{isValidated || isReadOnly ? (
				<QuizExplanations
					entries={items.flatMap((item) =>
						item.explanation == null ? [] : [{ definition: item.explanation, id: item.id, term: item.label }],
					)}
					label={t("explanations-label")}
				/>
			) : null}

			<QuizControls
				nextButtonLabel={controlsT("next-question")}
				onReset={reset}
				onShowSolution={isReadOnly ? undefined : showSolution}
				onValidate={() => {
					setStatus(order.every((itemIndex, position) => itemIndex === position) ? "correct" : "incorrect");
				}}
				previousButtonLabel={controlsT("previous-question")}
				resetButtonLabel={t("reset")}
				showSolutionButtonLabel={isReadOnly ? undefined : t("show-solution")}
				validateButtonLabel={t("check")}
			/>
		</section>
	);
}
