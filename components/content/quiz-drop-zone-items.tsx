"use client";

import cn from "clsx/lite";
import { CircleCheckIcon, CircleXIcon, GripVerticalIcon } from "lucide-react";
import { type DragEvent, type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

/**
 * The items of a drop zone exercise, shared by every exercise which drags items into zones: the bank they start in, the
 * chip an item turns into once placed, and the placement state that ties the two together.
 *
 * Keyboard and touch users open an item and pick a drop zone from a menu, which is also what WCAG 2.5.7 asks for: every
 * drag has to be achievable by a single pointer without dragging. Dragging is the enhancement on top of that.
 *
 * A press only starts a native drag when it lands on an element react-aria is not handling presses for, which is why an
 * item in the bank carries a separate grip - the chip itself has to stay a react-aria button to open the menu. A placed
 * item has no menu, so it is a plain button and can be dragged by itself.
 */
const dragType = "application/x-quiz-drop-zone-item";

export interface DropZoneItem {
	id: string;
	label: string;
	/** Index of the drop zone the item belongs in, or `null` for a distractor which belongs in none. */
	zoneIndex: number | null;
}

/** The number an item is known by while it is out of the bank, where its text no longer fits. */
export function getNumberedLabel(item: DropZoneItem, itemIndex: number): string {
	return `${String(itemIndex + 1)}. ${item.label}`;
}

export function startItemDrag(event: DragEvent<HTMLElement>, itemIndex: number, label: string): void {
	/** A placed item can sit inside a zone which is draggable itself, and that zone must not start a drag of its own. */
	event.stopPropagation();
	event.dataTransfer.setData(dragType, String(itemIndex));
	event.dataTransfer.setData("text/plain", label);
	event.dataTransfer.effectAllowed = "move";
}

/** `getData` is unreadable during dragover, so the payload type is all we can check. */
export function isItemDrag(event: DragEvent<HTMLElement>): boolean {
	return event.dataTransfer.types.includes(dragType);
}

export interface ItemPlacements {
	/**
	 * A zone shows an item's number, the bank shows its text; pointing at either lights up both, so the two halves can be
	 * read together without having to remember which number was which.
	 */
	activeItemIndex: number | null;
	bankItemRefs: RefObject<Map<number, HTMLButtonElement | null>>;
	/** Handles a drop onto a zone, or onto the bank with `null`. Ignores drags which are not an item of this exercise. */
	drop: (event: DragEvent<HTMLElement>, zoneIndex: number | null) => void;
	/** Whether every item sits where it belongs - including the distractors, which belong in the bank. */
	isSolved: boolean;
	place: (itemIndex: number, zoneIndex: number | null) => void;
	placedItemRefs: RefObject<Map<number, HTMLButtonElement | null>>;
	/** The zone each item currently sits in, by item index, or `null` while the item is still in the bank. */
	placements: Array<number | null>;
	reset: () => void;
	setActiveItemIndex: (itemIndex: number | null) => void;
	/** Puts every item where it belongs. */
	solve: () => void;
}

export function useItemPlacements(items: Array<DropZoneItem>, isReadOnly: boolean): ItemPlacements {
	const [placements, setPlacements] = useState<Array<number | null>>(() => items.map(() => null));
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

	function place(itemIndex: number, zoneIndex: number | null) {
		setPlacements((placements) => placements.map((placement, index) => (index === itemIndex ? zoneIndex : placement)));
		movedItemRef.current = { index: itemIndex, to: zoneIndex == null ? "bank" : "zone" };
	}

	function drop(event: DragEvent<HTMLElement>, zoneIndex: number | null) {
		event.preventDefault();

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

	return {
		activeItemIndex,
		bankItemRefs,
		drop,
		isSolved: items.every((item, index) => (placements[index] ?? null) === item.zoneIndex),
		place,
		placedItemRefs,
		placements,
		reset() {
			setPlacements(items.map(() => null));
		},
		setActiveItemIndex,
		solve() {
			setPlacements(items.map((item) => item.zoneIndex));
		},
	};
}

interface PlacedItemProps {
	itemIndex: number;
	/** The accessible name, which says where the item is and - once marked - whether that is right. */
	label: string;
	/** Whether the item is shown as right or wrong where it sits. */
	mark: "correct" | "incorrect" | null;
	placements: ItemPlacements;
	readOnly: boolean;
}

/**
 * An item once it sits in a zone. A zone is often a small region of an image, so what sits in it is the item's number
 * rather than its text. The number leads the accessible name too, because it is the visible label of the control.
 */
export function PlacedItem(props: Readonly<PlacedItemProps>): ReactNode {
	const { itemIndex, label, mark, placements, readOnly } = props;

	const { activeItemIndex, place, placedItemRefs, setActiveItemIndex } = placements;

	function clearActiveItem() {
		setActiveItemIndex(null);
	}

	return (
		<button
			ref={(element) => {
				placedItemRefs.current.set(itemIndex, element);
			}}
			aria-label={label}
			className={cn(
				"inline-flex items-center justify-center gap-x-1 rounded-sm border px-2 py-1 text-sm text-neutral-700 tabular-nums outline-none min-inline-8 focus-visible:ring-2 focus-visible:ring-brand-500",
				mark === "incorrect" ? "border-error-500 bg-error-50" : undefined,
				mark === "correct" ? "border-success-500 bg-success-50" : undefined,
				mark == null ? "border-neutral-300 bg-white" : undefined,
				activeItemIndex === itemIndex ? "ring-2 ring-brand-500" : undefined,
				readOnly ? undefined : "cursor-pointer hover:border-brand-400",
			)}
			disabled={readOnly}
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
			{mark === "correct" ? (
				<CircleCheckIcon aria-hidden={true} className="shrink-0 text-success-600 block-4 inline-4" />
			) : mark === "incorrect" ? (
				<CircleXIcon aria-hidden={true} className="shrink-0 text-error-600 block-4 inline-4" />
			) : null}
		</button>
	);
}

interface ItemBankProps {
	/** Names the item's control, which opens the menu of zones. */
	itemLabel: (item: DropZoneItem, itemIndex: number) => string;
	items: Array<DropZoneItem>;
	label: string;
	placements: ItemPlacements;
	readOnly: boolean;
	/** The zones an item can be sent to, by zone index. */
	zoneLabels: Array<string>;
	/** The order the menu lists the zones in, as zone indices. Defaults to the order of `zoneLabels`. */
	zoneOrder?: Array<number>;
}

/**
 * Placed items stay in the bank, greyed out, so it keeps a fixed size instead of reflowing after every move. Used
 * entries are hidden from assistive technology, leaving the list as the set still available.
 */
export function ItemBank(props: Readonly<ItemBankProps>): ReactNode {
	const { itemLabel, items, label, placements, readOnly, zoneLabels, zoneOrder } = props;

	const menuZoneIndices = zoneOrder ?? zoneLabels.map((_, zoneIndex) => zoneIndex);

	const { activeItemIndex, bankItemRefs, drop, place, placements: placed, setActiveItemIndex } = placements;

	const [isDropTarget, setIsDropTarget] = useState(false);

	function clearActiveItem() {
		setActiveItemIndex(null);
	}

	return (
		<div
			className={cn(
				"rounded-md border border-dashed p-3",
				isDropTarget ? "border-brand-500 bg-brand-50" : "border-neutral-300 bg-neutral-50",
			)}
			onDragLeave={() => {
				setIsDropTarget(false);
			}}
			onDragOver={(event) => {
				if (!readOnly && isItemDrag(event)) {
					event.preventDefault();
					setIsDropTarget(true);
				}
			}}
			onDrop={(event) => {
				setIsDropTarget(false);
				drop(event, null);
			}}
		>
			<ul aria-label={label} className="flex flex-wrap gap-2">
				{items.map((item, index) => {
					const isUsed = readOnly || placed[index] != null;

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
									aria-label={itemLabel(item, index)}
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
										{menuZoneIndices.map((zoneIndex) => (
											<MenuItem
												key={zoneIndex}
												className="cursor-pointer px-3 py-1 text-sm text-neutral-700 outline-none focus:bg-brand-50 focus:text-brand-700"
												id={String(zoneIndex)}
												textValue={zoneLabels[zoneIndex]}
											>
												{zoneLabels[zoneIndex]}
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
	);
}
