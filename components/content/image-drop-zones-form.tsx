"use client";

import cn from "clsx/lite";
import { CircleCheckIcon, CircleXIcon, GripVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type CSSProperties, type DragEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

import { QuizControls } from "#/components/content/quiz-controls.tsx";
import { useQuizContext } from "#/components/content/quiz.tsx";
import { Image } from "#/components/image.tsx";

/**
 * Keyboard and touch users open an item and pick a drop zone from a menu, which is also what WCAG 2.5.7 asks for: every
 * drag has to be achievable by a single pointer without dragging. Dragging is the enhancement on top of that.
 *
 * A press only starts a native drag when it lands on an element react-aria is not handling presses for, which is why an
 * item in the bank carries a separate grip - the chip itself has to stay a react-aria button to open the menu. A placed
 * item has no menu, so it is a plain button and can be dragged by itself.
 */
const dragType = "application/x-quiz-image-drop-zones";

export interface DropZoneItem {
	id: string;
	label: string;
	/** Index of the drop zone the item belongs in, or `null` for a distractor which belongs in none. */
	zoneIndex: number | null;
}

export interface DropZone {
	/** Revealed once the exercise has been answered, so it explains the zone without giving it away. */
	explanation?: ReactNode;
	label: string;
	/** Percentages of the background image. Ignored when the exercise has no image to position the zones on. */
	position: { height: number; width: number; x: number; y: number };
	shape: "ellipse" | "rectangle";
}

/** The number an item is known by while it is out of the bank, where its text no longer fits. */
function getNumberedLabel(item: DropZoneItem, itemIndex: number): string {
	return `${String(itemIndex + 1)}. ${item.label}`;
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

interface QuizImageDropZonesFormProps {
	alt: string;
	height?: number;
	/** Mark each item right or wrong as soon as it lands in a zone. */
	instantFeedback: boolean;
	items: Array<DropZoneItem>;
	/** What the exercise asks for, authored as content so it can carry links and emphasis. */
	question?: ReactNode;
	src?: string;
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

	/** The zone each item currently sits in, by item index, or `null` while the item is still in the bank. */
	const [placements, setPlacements] = useState<Array<number | null>>(() => items.map(() => null));
	const [dropTargetZoneIndex, setDropTargetZoneIndex] = useState<number | null>(null);
	const [isBankDropTarget, setIsBankDropTarget] = useState(false);
	/**
	 * A zone shows an item's number, the bank shows its text; pointing at either lights up both, so the two halves can be
	 * read together without having to remember which number was which.
	 */
	const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

	/**
	 * An item is its own control, so moving it unmounts the button the reader was on and focus would fall back to the
	 * document. Focus follows the item to where it went instead, which also announces its new state.
	 */
	const bankItemRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());
	const placedItemRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());
	/** Set while an item is on its way somewhere, and read once the button it moved to has rendered. */
	const movedItemRef = useRef<{ index: number; to: "bank" | "zone" } | null>(null);

	useEffect(() => {
		const movedItem = movedItemRef.current;
		if (movedItem == null) {
			return;
		}

		movedItemRef.current = null;

		const refs = movedItem.to === "zone" ? placedItemRefs : bankItemRefs;
		refs.current.get(movedItem.index)?.focus();
	}, [placements]);

	const isReadOnly = status === "solved";
	const isValidated = status === "correct" || status === "incorrect";

	/** Kept with the index the zone has in the exercise, so a zone without a label still names itself by its position. */
	const explainedZones = zones
		.map((zone, zoneIndex) => {
			return { zone, zoneIndex };
		})
		.filter((entry) => entry.zone.explanation != null);

	/** Distractors belong in no zone, so they add nothing to the score - but leaving one placed makes the answer wrong. */
	const total = items.filter((item) => item.zoneIndex != null).length;
	const correctCount = items.filter(
		(item, index) => item.zoneIndex != null && placements[index] === item.zoneIndex,
	).length;

	function clearActiveItem() {
		setActiveItemIndex(null);
	}

	function place(itemIndex: number, zoneIndex: number | null) {
		setPlacements((placements) => placements.map((placement, index) => (index === itemIndex ? zoneIndex : placement)));
		movedItemRef.current = { index: itemIndex, to: zoneIndex == null ? "bank" : "zone" };
	}

	function drop(event: DragEvent<HTMLElement>, zoneIndex: number | null) {
		event.preventDefault();
		setDropTargetZoneIndex(null);
		setIsBankDropTarget(false);

		/** A drag which carries no payload of ours is not ours to handle - an empty string would read as item zero. */
		const data = event.dataTransfer.getData(dragType);
		if (isReadOnly || data === "") {
			return;
		}

		const itemIndex = Number(data);
		if (!Number.isInteger(itemIndex) || items[itemIndex] == null) {
			return;
		}

		place(itemIndex, zoneIndex);
	}

	function reset() {
		setPlacements(items.map(() => null));
		setStatus("idle");
	}

	function showSolution() {
		setPlacements(items.map((item) => item.zoneIndex));
		setStatus("solved");
	}

	function renderZone(zone: DropZone, zoneIndex: number): ReactNode {
		const label = zone.label || t("zone-label", { index: String(zoneIndex + 1) });
		const isDropTarget = dropTargetZoneIndex === zoneIndex;
		/** The height is a minimum, so a zone which fills up grows instead of hiding what was dropped into it. */
		const style =
			src == null
				? undefined
				: ({
						insetBlockStart: `${String(zone.position.y)}%`,
						insetInlineStart: `${String(zone.position.x)}%`,
						inlineSize: `${String(zone.position.width)}%`,
						minBlockSize: `${String(zone.position.height)}%`,
					} as CSSProperties);

		/**
		 * Hit testing follows the border radius, so an ellipse turns away what is dropped into the corners of its box.
		 * Without an image the zones are laid out in a grid, where an ellipse would only crop what was dropped into it.
		 */
		const isEllipse = src != null && zone.shape === "ellipse";

		return (
			// oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Mouse convenience; every item's menu offers the same move.
			<div
				key={zoneIndex}
				aria-label={label}
				className={cn(
					"flex flex-col gap-y-1 border-2 border-dashed p-2 transition",
					isEllipse ? "items-center justify-center rounded-[50%] text-center" : "rounded-md",
					src == null ? "bg-neutral-50 min-block-24" : "absolute bg-white/85",
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
					drop(event, zoneIndex);
				}}
				role="group"
				style={style}
			>
				<p className="text-xs font-medium text-neutral-700">{label}</p>

				<ul className={cn("flex flex-wrap gap-1", isEllipse ? "justify-center" : undefined)}>
					{items.map((item, index) => {
						if (placements[index] !== zoneIndex) {
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
		const isCorrect = placements[itemIndex] === item.zoneIndex;
		/** In the solved state every item sits where it belongs, so marking each one adds nothing. */
		const isMarked = !isReadOnly && (isValidated || instantFeedback);

		/**
		 * A zone is a region of the image, often a small one, so what sits in it is the item's number rather than its text.
		 * The number leads the accessible name too, because it is the visible label of the control.
		 */
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
			<button
				ref={(element) => {
					placedItemRefs.current.set(itemIndex, element);
				}}
				aria-label={label}
				className={cn(
					"inline-flex items-center justify-center gap-x-1 rounded-sm border px-2 py-1 text-sm text-neutral-700 tabular-nums outline-none min-inline-8 focus-visible:ring-2 focus-visible:ring-brand-500",
					isMarked && !isCorrect ? "border-error-500 bg-error-50" : undefined,
					isMarked && isCorrect ? "border-success-500 bg-success-50" : undefined,
					isMarked ? undefined : "border-neutral-300 bg-white",
					activeItemIndex === itemIndex ? "ring-2 ring-brand-500" : undefined,
					isReadOnly ? undefined : "cursor-pointer hover:border-brand-400",
				)}
				disabled={isReadOnly}
				onBlur={clearActiveItem}
				onClick={() => {
					place(itemIndex, null);
				}}
				onFocus={() => {
					setActiveItemIndex(itemIndex);
				}}
				onPointerEnter={() => {
					setActiveItemIndex(itemIndex);
				}}
				onPointerLeave={clearActiveItem}
				type="button"
			>
				<span>{itemIndex + 1}</span>
				{isMarked ? (
					isCorrect ? (
						<CircleCheckIcon aria-hidden={true} className="shrink-0 text-success-600 block-4 inline-4" />
					) : (
						<CircleXIcon aria-hidden={true} className="shrink-0 text-error-600 block-4 inline-4" />
					)
				) : null}
			</button>
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
				{src != null ? (
					<div className="relative isolate self-start overflow-hidden rounded-md">
						<Image alt={alt} className="block-auto inline-full" height={height} src={src} width={width} />
						{zones.map((zone, zoneIndex) => renderZone(zone, zoneIndex))}
					</div>
				) : (
					<div className="grid gap-3 @[36rem]:grid-cols-2">
						{zones.map((zone, zoneIndex) => renderZone(zone, zoneIndex))}
					</div>
				)}

				{/*
				 * Placed items stay in the bank, greyed out, so it keeps a fixed size instead of reflowing after every
				 * move. Used entries are hidden from assistive technology, leaving the list as the set still available.
				 */}
				<div
					className={cn(
						"rounded-md border border-dashed p-3",
						isBankDropTarget ? "border-brand-500 bg-brand-50" : "border-neutral-300 bg-neutral-50",
					)}
					onDragLeave={() => {
						setIsBankDropTarget(false);
					}}
					onDragOver={(event) => {
						if (!isReadOnly && isItemDrag(event)) {
							event.preventDefault();
							setIsBankDropTarget(true);
						}
					}}
					onDrop={(event) => {
						drop(event, null);
					}}
				>
					<ul aria-label={t("item-bank-label")} className="flex flex-wrap gap-2">
						{items.map((item, index) => {
							const isUsed = isReadOnly || placements[index] != null;

							if (isUsed) {
								return (
									<li
										key={item.id}
										aria-hidden={true}
										className={cn(
											"rounded-sm border border-dashed px-2 py-1 text-sm transition",
											activeItemIndex === index
												? "border-brand-500 bg-brand-50 text-neutral-700"
												: "border-neutral-300 bg-neutral-50 text-neutral-600",
										)}
									>
										{/*
										 * Kept readable rather than blanked out: once an item is in a zone the zone shows only its number, so
										 * the bank is the one place its text can still be read.
										 */}
										<span
											className={cn(
												"me-1 inline-flex items-center justify-center rounded-xs px-1 text-xs font-medium tabular-nums min-inline-4",
												activeItemIndex === index ? "bg-brand-100 text-brand-800" : "bg-neutral-200 text-neutral-500",
											)}
										>
											{index + 1}
										</span>{" "}
										{item.label}
									</li>
								);
							}

							return (
								// oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Mouse convenience; the item itself is a menu button.
								<li
									key={item.id}
									draggable={true}
									onDragStart={(event) => {
										startItemDrag(event, index, item.label);
									}}
								>
									{/* Pointer-only, and duplicated by the menu, so it is not offered to assistive technology. */}
									<span aria-hidden={true} className="inline-flex cursor-grab align-middle text-neutral-400">
										<GripVerticalIcon className="block-4 inline-4" />
									</span>
									<MenuTrigger>
										<Button
											ref={(element) => {
												bankItemRefs.current.set(index, element);
											}}
											aria-label={t("item-label", { item: getNumberedLabel(item, index) })}
											className={cn(
												"cursor-grab rounded-sm border bg-white px-2 py-1 text-sm text-neutral-700 transition outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
												activeItemIndex === index ? "border-brand-500 bg-brand-50" : "border-neutral-300",
											)}
											onBlur={clearActiveItem}
											onFocus={() => {
												setActiveItemIndex(index);
											}}
											onHoverChange={(isHovered) => {
												setActiveItemIndex(isHovered ? index : null);
											}}
										>
											<span
												className={cn(
													"me-1 inline-flex items-center justify-center rounded-xs px-1 text-xs font-medium tabular-nums min-inline-4",
													activeItemIndex === index ? "bg-brand-100 text-brand-800" : "bg-neutral-100 text-neutral-500",
												)}
											>
												{index + 1}
											</span>{" "}
											{item.label}
										</Button>
										<Popover
											className="rounded-md border border-neutral-200 bg-white py-1 shadow-md min-inline-32"
											offset={4}
											placement="bottom start"
										>
											{/*
											 * The menu is named after its trigger by react-aria, which already reads as
											 * "<item>. Choose a drop zone.", so a label of its own would only be overridden.
											 */}
											<Menu
												className="outline-none"
												onAction={(key) => {
													place(index, Number(key));
												}}
											>
												{zones.map((zone, zoneIndex) => (
													<MenuItem
														key={zoneIndex}
														className="cursor-pointer px-3 py-1 text-sm text-neutral-700 outline-none focus:bg-brand-50 focus:text-brand-700"
														id={String(zoneIndex)}
														textValue={zone.label || t("zone-label", { index: String(zoneIndex + 1) })}
													>
														{zone.label || t("zone-label", { index: String(zoneIndex + 1) })}
													</MenuItem>
												))}
											</Menu>
										</Popover>
									</MenuTrigger>
								</li>
							);
						})}
					</ul>
				</div>
			</div>

			{isValidated ? (
				<p className="not-prose text-sm font-medium text-neutral-600" role="status">
					{t("score", { correct: String(correctCount), total: String(total) })}
				</p>
			) : null}

			{/* Held back until the exercise has been answered, so it explains the zones instead of solving them. */}
			{(isValidated || isReadOnly) && explainedZones.length > 0 ? (
				<div className="grid gap-y-2">
					{/* A widget must emit no headings, or it would turn up in the table of contents - see `Callout`. */}
					<strong className="not-prose text-sm font-bold text-neutral-600">{t("explanations-label")}</strong>

					<dl className="grid gap-y-3">
						{explainedZones.map(({ zone, zoneIndex }) => (
							<div key={zoneIndex} className="grid gap-y-1">
								<dt className="not-prose text-sm font-medium text-neutral-700">
									{zone.label || t("zone-label", { index: String(zoneIndex + 1) })}
								</dt>
								<dd className="ms-0 text-sm text-neutral-700 **:first:mbs-0 **:last:mbe-0">{zone.explanation}</dd>
							</div>
						))}
					</dl>
				</div>
			) : null}

			<QuizControls
				nextButtonLabel={controlsT("next-question")}
				onReset={reset}
				onShowSolution={isReadOnly ? undefined : showSolution}
				onValidate={() => {
					/** A distractor left in the bank is part of the answer, so the score alone does not decide this. */
					setStatus(
						items.every((item, index) => (placements[index] ?? null) === item.zoneIndex) ? "correct" : "incorrect",
					);
				}}
				previousButtonLabel={controlsT("previous-question")}
				resetButtonLabel={t("reset")}
				showSolutionButtonLabel={isReadOnly ? undefined : t("show-solution")}
				validateButtonLabel={t("check")}
			/>
		</section>
	);
}
