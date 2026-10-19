"use client";

import cn from "clsx/lite";
import { useTranslations } from "next-intl";
import { type CSSProperties, type ReactNode, useState } from "react";

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
import { useQuizContext } from "#/components/content/quiz.tsx";
import { Image } from "#/components/image.tsx";

export interface DropZone {
	/** Revealed once the exercise has been answered, so it explains the zone without giving it away. */
	explanation?: ReactNode;
	label: string;
	/** Percentages of the background image. */
	position: { height: number; width: number; x: number; y: number };
	shape: "ellipse" | "rectangle";
}

interface QuizImageDropZonesFormProps {
	alt: string;
	height?: number;
	/** Mark each item right or wrong as soon as it lands in a zone. */
	instantFeedback: boolean;
	items: Array<DropZoneItem>;
	/** What the exercise asks for, authored as content so it can carry links and emphasis. */
	question?: ReactNode;
	src: string;
	width?: number;
	zones: Array<DropZone>;
}

/**
 * The interactive half of `QuizImageDropZones`. Collecting the zones and their items out of the children happens in the
 * server component, so components can be identified by comparing `child.type`.
 */
export function QuizImageDropZonesForm(props: Readonly<QuizImageDropZonesFormProps>): ReactNode {
	const { alt, height, instantFeedback, items, question, src, width, zones } = props;

	const t = useTranslations("content.QuizImageDropZones");
	const controlsT = useTranslations("content.QuizControls");

	const { isCurrent, setStatus, status } = useQuizContext();

	const isReadOnly = status === "solved";
	const isValidated = status === "correct" || status === "incorrect";

	const placements = useItemPlacements(items, isReadOnly);
	const [dropTargetZoneIndex, setDropTargetZoneIndex] = useState<number | null>(null);

	const zoneLabels = zones.map((zone, zoneIndex) => zone.label || t("zone-label", { index: String(zoneIndex + 1) }));

	/** Distractors belong in no zone, so they add nothing to the score - but leaving one placed makes the answer wrong. */
	const total = items.filter((item) => item.zoneIndex != null).length;
	const correctCount = items.filter(
		(item, index) => item.zoneIndex != null && placements.placements[index] === item.zoneIndex,
	).length;

	function reset() {
		placements.reset();
		setStatus("idle");
	}

	function showSolution() {
		placements.solve();
		setStatus("solved");
	}

	function renderZone(zone: DropZone, zoneIndex: number): ReactNode {
		const label = zoneLabels[zoneIndex]!;
		const isDropTarget = dropTargetZoneIndex === zoneIndex;
		/** The height is a minimum, so a zone which fills up grows instead of hiding what was dropped into it. */
		const style = {
			insetBlockStart: `${String(zone.position.y)}%`,
			insetInlineStart: `${String(zone.position.x)}%`,
			inlineSize: `${String(zone.position.width)}%`,
			minBlockSize: `${String(zone.position.height)}%`,
		} as CSSProperties;

		/** Hit testing follows the border radius, so an ellipse turns away what is dropped into the corners of its box. */
		const isEllipse = zone.shape === "ellipse";

		return (
			// oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Mouse convenience; every item's menu offers the same move.
			<div
				key={zoneIndex}
				aria-label={label}
				className={cn(
					"absolute flex flex-col gap-y-1 border-2 border-dashed bg-white/85 p-2 transition",
					isEllipse ? "items-center justify-center rounded-[50%] text-center" : "rounded-md",
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
				style={style}
			>
				<p className="text-xs font-medium text-neutral-700">{label}</p>

				<ul className={cn("flex flex-wrap gap-1", isEllipse ? "justify-center" : undefined)}>
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
								{renderPlacedItem(item, index, label)}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}

	function renderPlacedItem(item: DropZoneItem, itemIndex: number, zoneLabel: string): ReactNode {
		const isCorrect = placements.placements[itemIndex] === item.zoneIndex;
		/** In the solved state every item sits where it belongs, so marking each one adds nothing. */
		const isMarked = !isReadOnly && (isValidated || instantFeedback);
		const numbered = getNumberedLabel(item, itemIndex);

		let label = t("placed-item-label", { item: numbered, zone: zoneLabel });
		if (isReadOnly) {
			label = t("solution-item-label", { item: numbered, zone: zoneLabel });
		} else if (isMarked) {
			label = isCorrect
				? t("placed-item-label-correct", { item: numbered, zone: zoneLabel })
				: t("placed-item-label-incorrect", { item: numbered, zone: zoneLabel });
		}

		return (
			<PlacedItem
				itemIndex={itemIndex}
				label={label}
				mark={isMarked ? (isCorrect ? "correct" : "incorrect") : null}
				placements={placements}
				readOnly={isReadOnly}
			/>
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
				<div className="relative isolate self-start overflow-hidden rounded-md">
					<Image alt={alt} className="block-auto inline-full" height={height} src={src} width={width} />
					{zones.map((zone, zoneIndex) => renderZone(zone, zoneIndex))}
				</div>

				<ItemBank
					itemLabel={(item, index) => t("item-label", { item: getNumberedLabel(item, index) })}
					items={items}
					label={t("item-bank-label")}
					placements={placements}
					readOnly={isReadOnly}
					zoneLabels={zoneLabels}
				/>
			</div>

			{isValidated ? (
				<p className="not-prose text-sm font-medium text-neutral-600" role="status">
					{t("score", { correct: String(correctCount), total: String(total) })}
				</p>
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
					setStatus(placements.isSolved ? "correct" : "incorrect");
				}}
				previousButtonLabel={controlsT("previous-question")}
				resetButtonLabel={t("reset")}
				showSolutionButtonLabel={isReadOnly ? undefined : t("show-solution")}
				validateButtonLabel={t("check")}
			/>
		</section>
	);
}
