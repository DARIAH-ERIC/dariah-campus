"use client";

import cn from "clsx/lite";
import { CircleCheckIcon, CircleXIcon, GripVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type DragEvent, type ReactNode, useState } from "react";
import { Button, MenuTrigger } from "react-aria-components";

import { QuizControls } from "#/components/content/quiz-controls.tsx";
import {
	type DropZoneItem,
	ItemBank,
	PlacedItem,
	getNumberedLabel,
	isItemDrag,
	startItemDrag,
	useItemPlacements,
} from "#/components/content/quiz-drop-zone-items.tsx";
import { QuizExplanations } from "#/components/content/quiz-explanations.tsx";
import { PositionMenu, moveTo } from "#/components/content/quiz-positions.tsx";
import { useQuizContext } from "#/components/content/quiz.tsx";

/**
 * A zone in an ordered exercise is dragged as well as dropped into, and the two are told apart by what the drag
 * carries. Keyboard and touch users move a zone through its position menu instead - see `PositionMenu`.
 */
const zoneDragType = "application/x-quiz-matching-zone";

export interface MatchingZone {
	/** Revealed once the exercise has been answered, so it explains the zone without giving it away. */
	explanation?: ReactNode;
	label: string;
}

function startZoneDrag(event: DragEvent<HTMLElement>, zoneIndex: number, label: string) {
	event.dataTransfer.setData(zoneDragType, String(zoneIndex));
	event.dataTransfer.setData("text/plain", label);
	event.dataTransfer.effectAllowed = "move";
}

function isZoneDrag(event: DragEvent<HTMLElement>): boolean {
	return event.dataTransfer.types.includes(zoneDragType);
}

interface QuizMatchingFormProps {
	/**
	 * Zone indices in the order the user starts from, which is a scramble of the solution - or `null` when the order of
	 * the zones is not part of the answer.
	 */
	initialZoneOrder: Array<number> | null;
	/** Mark each item right or wrong as soon as it lands in a zone. */
	instantFeedback: boolean;
	items: Array<DropZoneItem>;
	/** What the exercise asks for, authored as content so it can carry links and emphasis. */
	question?: ReactNode;
	/** In the order they were authored, which - when the order matters - is the solution. */
	zones: Array<MatchingZone>;
}

/**
 * The interactive half of `QuizMatching`. Collecting the zones and their items out of the children happens in the
 * server component, so components can be identified by comparing `child.type`.
 */
export function QuizMatchingForm(props: Readonly<QuizMatchingFormProps>): ReactNode {
	const { initialZoneOrder, instantFeedback, items, question, zones } = props;

	const t = useTranslations("content.QuizMatching");
	const controlsT = useTranslations("content.QuizControls");

	const { isCurrent, setStatus, status } = useQuizContext();

	const isReadOnly = status === "solved";
	const isValidated = status === "correct" || status === "incorrect";
	const isOrdered = initialZoneOrder != null;

	const placements = useItemPlacements(items, isReadOnly);
	const [dropTargetZoneIndex, setDropTargetZoneIndex] = useState<number | null>(null);

	/** The zone at each position, by zone index. A zone is in place when its index equals its position. */
	const [zoneOrder, setZoneOrder] = useState(() => initialZoneOrder ?? zones.map((_, zoneIndex) => zoneIndex));
	const [zoneDropTargetPosition, setZoneDropTargetPosition] = useState<number | null>(null);
	/**
	 * Every zone has a position from the start, so instant feedback on the sequence waits for the first move - marking
	 * the initial scramble would tell the user which zones already sit in place before they have done anything.
	 */
	const [hasMovedZone, setHasMovedZone] = useState(false);
	/**
	 * A moved zone keeps its control, so focus stays on it - but a change to its accessible name is not announced, so the
	 * move is reported through a live region instead.
	 */
	const [announcement, setAnnouncement] = useState<string | null>(null);

	const zoneLabels = zones.map((zone, zoneIndex) => zone.label || t("zone-label", { index: String(zoneIndex + 1) }));

	/** In the solved state everything sits where it belongs, so marking each part adds nothing. */
	const isItemMarked = !isReadOnly && (isValidated || instantFeedback);
	const isZoneMarked = isOrdered && !isReadOnly && (isValidated || (instantFeedback && hasMovedZone));

	/** Distractors belong in no zone, so they add nothing to the score - but leaving one placed makes the answer wrong. */
	const total = items.filter((item) => item.zoneIndex != null).length;
	const correctCount = items.filter(
		(item, index) => item.zoneIndex != null && placements.placements[index] === item.zoneIndex,
	).length;
	const isSequenceSolved = zoneOrder.every((zoneIndex, position) => zoneIndex === position);
	const zonesInPlaceCount = zoneOrder.filter((zoneIndex, position) => zoneIndex === position).length;

	function moveZone(zoneIndex: number, position: number) {
		setZoneOrder((order) => moveTo(order, zoneIndex, position));
		setHasMovedZone(true);
		setAnnouncement(
			t("zone-moved", { position: String(position + 1), total: String(zones.length), zone: zoneLabels[zoneIndex]! }),
		);
	}

	function dropZone(event: DragEvent<HTMLElement>, position: number) {
		event.preventDefault();
		setZoneDropTargetPosition(null);

		/** A drag which carries no payload of ours is not ours to handle - an empty string would read as zone zero. */
		const data = event.dataTransfer.getData(zoneDragType);
		if (isReadOnly || data === "") {
			return;
		}

		const zoneIndex = Number(data);
		if (!Number.isInteger(zoneIndex) || zones[zoneIndex] == null) {
			return;
		}

		moveZone(zoneIndex, position);
	}

	function reset() {
		placements.reset();
		setZoneOrder(initialZoneOrder ?? zones.map((_, zoneIndex) => zoneIndex));
		setHasMovedZone(false);
		setAnnouncement(null);
		setStatus("idle");
	}

	function showSolution() {
		placements.solve();
		setZoneOrder(zones.map((_, zoneIndex) => zoneIndex));
		setAnnouncement(null);
		setStatus("solved");
	}

	function renderPlacedItem(item: DropZoneItem, itemIndex: number, zoneLabel: string): ReactNode {
		const isCorrect = placements.placements[itemIndex] === item.zoneIndex;
		const numbered = getNumberedLabel(item, itemIndex);

		let label = t("placed-item-label", { item: numbered, zone: zoneLabel });
		if (isReadOnly) {
			label = t("solution-item-label", { item: numbered, zone: zoneLabel });
		} else if (isItemMarked) {
			label = isCorrect
				? t("placed-item-label-correct", { item: numbered, zone: zoneLabel })
				: t("placed-item-label-incorrect", { item: numbered, zone: zoneLabel });
		}

		return (
			<PlacedItem
				itemIndex={itemIndex}
				label={label}
				mark={isItemMarked ? (isCorrect ? "correct" : "incorrect") : null}
				placements={placements}
				readOnly={isReadOnly}
			/>
		);
	}

	function renderPlacedItems(zoneIndex: number, zoneLabel: string): ReactNode {
		return (
			/** Hidden while empty, so it does not add a column gap below the zone's title and push the title off centre. */
			<ul className="flex flex-wrap gap-1 empty:hidden">
				{items.map((item, index) => {
					if (placements.placements[index] !== zoneIndex) {
						return null;
					}

					return (
						// oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Mouse convenience; the item itself is a button.
						<li
							key={item.id}
							draggable={!isReadOnly}
							onDragStart={(event) => {
								startItemDrag(event, index, item.label);
							}}
						>
							{renderPlacedItem(item, index, zoneLabel)}
						</li>
					);
				})}
			</ul>
		);
	}

	/** A zone in an exercise where only the matches matter: a card in a grid, and a drop target for items. */
	function renderZone(zoneIndex: number): ReactNode {
		const label = zoneLabels[zoneIndex]!;
		const isDropTarget = dropTargetZoneIndex === zoneIndex;

		return (
			// oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Mouse convenience; every item's menu offers the same move.
			<div
				key={zoneIndex}
				aria-label={label}
				className={cn(
					"flex flex-col gap-y-1 rounded-md border-2 border-dashed bg-neutral-50 p-2 transition min-block-24",
					isDropTarget ? "border-brand-500 bg-brand-50" : "border-neutral-400",
				)}
				onDragLeave={() => {
					setDropTargetZoneIndex((current) => (current === zoneIndex ? null : current));
				}}
				onDragOver={(event) => {
					if (!isReadOnly && isItemDrag(event)) {
						event.preventDefault();
						setDropTargetZoneIndex(zoneIndex);
					}
				}}
				onDrop={(event) => {
					setDropTargetZoneIndex(null);
					placements.drop(event, zoneIndex);
				}}
				role="group"
			>
				<p className="text-xs font-medium text-neutral-700">{label}</p>

				{renderPlacedItems(zoneIndex, label)}
			</div>
		);
	}

	/**
	 * A zone in an exercise where the sequence matters too: a row which takes items like a card does, and which is itself
	 * moved to a position - by its grip, or through the menu its title opens.
	 */
	function renderOrderedZone(zoneIndex: number, position: number): ReactNode {
		const label = zoneLabels[zoneIndex]!;
		const isInPlace = zoneIndex === position;
		const isItemDropTarget = dropTargetZoneIndex === zoneIndex;
		const isZoneDropTarget = zoneDropTargetPosition === position;
		const values = { position: String(position + 1), total: String(zones.length), zone: label };

		let positionLabel = t("zone-position-label", values);
		if (isReadOnly) {
			positionLabel = t("zone-solution-label", values);
		} else if (isZoneMarked) {
			positionLabel = isInPlace ? t("zone-position-label-correct", values) : t("zone-position-label-incorrect", values);
		}

		return (
			// oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Mouse convenience; the menus offer every move.
			<li
				key={zoneIndex}
				className={cn(
					"rounded-md border-2 border-dashed p-2 transition",
					isItemDropTarget || isZoneDropTarget ? "border-brand-500 bg-brand-50" : undefined,
					!isItemDropTarget && !isZoneDropTarget && isZoneMarked && !isInPlace
						? "border-error-500 bg-error-50"
						: undefined,
					!isItemDropTarget && !isZoneDropTarget && isZoneMarked && isInPlace
						? "border-success-500 bg-success-50"
						: undefined,
					!isItemDropTarget && !isZoneDropTarget && !isZoneMarked ? "border-neutral-400 bg-neutral-50" : undefined,
				)}
				draggable={!isReadOnly}
				onDragLeave={() => {
					setDropTargetZoneIndex((current) => (current === zoneIndex ? null : current));
					setZoneDropTargetPosition((current) => (current === position ? null : current));
				}}
				onDragOver={(event) => {
					if (isReadOnly) {
						return;
					}

					if (isItemDrag(event)) {
						event.preventDefault();
						setDropTargetZoneIndex(zoneIndex);
					} else if (isZoneDrag(event)) {
						event.preventDefault();
						setZoneDropTargetPosition(position);
					}
				}}
				onDragStart={(event) => {
					startZoneDrag(event, zoneIndex, label);
				}}
				onDrop={(event) => {
					setDropTargetZoneIndex(null);

					if (isZoneDrag(event)) {
						dropZone(event, position);
					} else {
						placements.drop(event, zoneIndex);
					}
				}}
			>
				<div aria-label={label} className="flex flex-col gap-y-1" role="group">
					<div className="flex items-center gap-x-2">
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
								isZoneMarked && !isInPlace ? "bg-error-100 text-error-800" : undefined,
								isZoneMarked && isInPlace ? "bg-success-100 text-success-800" : undefined,
								isZoneMarked ? undefined : "bg-neutral-200 text-neutral-600",
							)}
						>
							{position + 1}
						</span>

						<MenuTrigger>
							<Button
								aria-label={positionLabel}
								className={cn(
									"flex-1 rounded-sm px-1 py-0.5 text-start text-xs font-medium text-neutral-700 outline-none min-inline-0 focus-visible:ring-2 focus-visible:ring-brand-500",
									isReadOnly ? undefined : "cursor-grab hover:bg-neutral-100",
								)}
								isDisabled={isReadOnly}
							>
								{label}
							</Button>
							<PositionMenu
								current={position}
								label={(position) => t("position-label", { position: String(position) })}
								onMove={(position) => {
									moveZone(zoneIndex, position);
								}}
								total={zones.length}
							/>
						</MenuTrigger>

						{isZoneMarked ? (
							isInPlace ? (
								<CircleCheckIcon aria-hidden={true} className="shrink-0 text-success-600 block-4 inline-4" />
							) : (
								<CircleXIcon aria-hidden={true} className="shrink-0 text-error-600 block-4 inline-4" />
							)
						) : null}
					</div>

					{renderPlacedItems(zoneIndex, label)}
				</div>
			</li>
		);
	}

	return (
		<section
			className="@container my-4 grid gap-4 rounded-md border border-neutral-200 bg-white px-4 py-6 text-sm/relaxed text-neutral-950 shadow-sm"
			hidden={!isCurrent}
		>
			{/* Outside `not-prose`, so the links and emphasis an author reaches for still render. */}
			{question != null ? <header className="border-be border-neutral-200 pbe-4 text-base">{question}</header> : null}

			<div className="not-prose grid gap-y-4">
				{isOrdered ? (
					/** A single column, so which zone comes first is never in doubt. */
					<ol aria-label={t("zones-label")} className="grid gap-y-2">
						{zoneOrder.map((zoneIndex, position) => renderOrderedZone(zoneIndex, position))}
					</ol>
				) : (
					<div className="grid gap-3 @[36rem]:grid-cols-2">{zones.map((_, zoneIndex) => renderZone(zoneIndex))}</div>
				)}

				<ItemBank
					itemLabel={(item, index) => t("item-label", { item: getNumberedLabel(item, index) })}
					items={items}
					label={t("item-bank-label")}
					placements={placements}
					readOnly={isReadOnly}
					zoneLabels={zoneLabels}
					zoneOrder={zoneOrder}
				/>
			</div>

			{/* Always in the document, so the live region exists before the first move it has to announce. */}
			{isOrdered ? (
				<p className="sr-only" role="status">
					{announcement}
				</p>
			) : null}

			{isValidated ? (
				<div className="not-prose grid gap-y-1 text-sm font-medium text-neutral-600" role="status">
					<p>{t("score", { correct: String(correctCount), total: String(total) })}</p>
					{isOrdered ? (
						<p>{t("sequence-score", { correct: String(zonesInPlaceCount), total: String(zones.length) })}</p>
					) : null}
				</div>
			) : null}

			{isValidated || isReadOnly ? (
				<QuizExplanations
					entries={zones.flatMap((zone, zoneIndex) =>
						zone.explanation == null
							? []
							: [{ definition: zone.explanation, id: String(zoneIndex), term: zoneLabels[zoneIndex]! }],
					)}
					label={t("explanations-label")}
				/>
			) : null}

			<QuizControls
				nextButtonLabel={controlsT("next-question")}
				onReset={reset}
				onShowSolution={isReadOnly ? undefined : showSolution}
				onValidate={() => {
					/** A distractor left in the bank is part of the answer, so the score alone does not decide this. */
					setStatus(placements.isSolved && (!isOrdered || isSequenceSolved) ? "correct" : "incorrect");
				}}
				previousButtonLabel={controlsT("previous-question")}
				resetButtonLabel={t("reset")}
				showSolutionButtonLabel={isReadOnly ? undefined : t("show-solution")}
				validateButtonLabel={t("check")}
			/>
		</section>
	);
}
