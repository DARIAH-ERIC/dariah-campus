import type { ReactNode } from "react";

import {
	type DragAndDropItem,
	type DragAndDropZone,
	QuizDragAndDropForm,
} from "#/components/content/drag-and-drop-form.tsx";
import { getChildrenByType } from "#/components/content/get-children-by-type.ts";
import { getSortKey } from "#/components/content/get-sort-key.ts";

/** A list from the cms, or a comma separated string in hand-written mdx. */
function toList(value: Array<string> | string | undefined): Array<string> {
	if (value == null) {
		return [];
	}

	return (typeof value === "string" ? value.split(",") : value).map((entry) => entry.trim()).filter(Boolean);
}

interface QuizDragAndDropProps {
	alt?: string;
	children: ReactNode;
	/**
	 * Decoy items that join the bank but belong in no zone, so the exercise cannot be solved by elimination. Leaving them
	 * in the bank is part of the correct answer.
	 */
	distractors?: Array<string> | string;
	height?: number;
	/** Mark each item right or wrong as soon as it lands in a zone. */
	instantFeedback?: boolean;
	src?: string;
	width?: number;
}

/**
 * Note that this must stay a server component: it identifies its children by comparing `child.type`, which only works
 * while the mdx components and the imports here resolve to the same objects. In a client component the children arrive
 * as separate lazy references, and nothing matches.
 */
export function QuizDragAndDrop(props: Readonly<QuizDragAndDropProps>): ReactNode {
	const { alt = "", children, distractors, height, instantFeedback = false, src, width } = props;

	const get = getChildrenByType(children);
	const dropZones = get(QuizDropZone);

	const zones: Array<DragAndDropZone> = dropZones.map((zone) => {
		return {
			label: zone.props.label ?? "",
			position: {
				height: zone.props.height ?? 20,
				width: zone.props.width ?? 25,
				x: zone.props.x ?? 0,
				y: zone.props.y ?? 0,
			},
		};
	});

	/**
	 * Every zone contributes the items which belong in it, and the distractors belong in none. They are ordered so the
	 * two are indistinguishable, and so the bank does not give away which zone an item was authored for.
	 */
	const items: Array<DragAndDropItem> = [
		...dropZones.flatMap((zone, zoneIndex) =>
			toList(zone.props.items).map((label, index) => {
				return { id: `item-${String(zoneIndex)}-${String(index)}`, label, zoneIndex };
			}),
		),
		...toList(distractors).map((label, index) => {
			return { id: `distractor-${String(index)}`, label, zoneIndex: null };
		}),
		// oxlint-disable-next-line unicorn/no-array-sort
	].sort((a, b) => getSortKey(a.label) - getSortKey(b.label));

	/** The cms saves entries even when a required field was left empty, so an exercise nobody can solve is dropped. */
	if (zones.length === 0 || items.length === 0) {
		return null;
	}

	return (
		<QuizDragAndDropForm
			alt={alt}
			height={height}
			instantFeedback={instantFeedback}
			items={items}
			src={src}
			width={width}
			zones={zones}
		/>
	);
}

interface QuizDropZoneProps {
	/** Percentages of the background image, used only when the exercise has one. */
	height?: number;
	/** The items which belong in this zone. A list from the cms, or a comma separated string in hand-written mdx. */
	items?: Array<string> | string;
	label?: string;
	width?: number;
	x?: number;
	y?: number;
}

export function QuizDropZone(_props: Readonly<QuizDropZoneProps>): ReactNode {
	return null;
}
