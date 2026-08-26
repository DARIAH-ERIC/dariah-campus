import type { ReactNode } from "react";

import { getChildrenByType } from "#/components/content/get-children-by-type.ts";
import { getChildrenElements } from "#/components/content/get-children-elements.ts";
import { getSortKey } from "#/components/content/get-sort-key.ts";
import {
	type DropZone,
	type DropZoneItem,
	QuizImageDropZonesForm,
} from "#/components/content/image-drop-zones-form.tsx";
import { QuizQuestion } from "#/components/content/quiz-question.tsx";

/** An item as the cms writes it. Kept an object so a field can be added to it without rewriting existing content. */
interface Item {
	label: string;
}

/**
 * A list of items from the cms, or - in hand-written mdx, where an object per item would only be noise - a list of
 * labels or a single comma separated string.
 */
function toItems(value: Array<Item> | Array<string> | string | undefined): Array<Item> {
	if (value == null) {
		return [];
	}

	const entries = typeof value === "string" ? value.split(",") : value;

	return entries
		.map((entry) => {
			return { label: (typeof entry === "string" ? entry : entry.label).trim() };
		})
		.filter((entry) => entry.label !== "");
}

interface QuizImageDropZonesProps {
	alt?: string;
	children: ReactNode;
	/**
	 * Decoy items that join the bank but belong in no zone, so the exercise cannot be solved by elimination. Leaving them
	 * in the bank is part of the correct answer.
	 */
	distractors?: Array<Item> | Array<string> | string;
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
export function QuizImageDropZones(props: Readonly<QuizImageDropZonesProps>): ReactNode {
	const { alt = "", children, distractors, height, instantFeedback = false, src, width } = props;

	const get = getChildrenByType(children);
	const dropZones = get(QuizImageDropZone);
	const question = get(QuizQuestion);

	const zones: Array<DropZone> = dropZones.map((zone) => {
		return {
			/**
			 * Whatever the zone wraps explains what belongs in it, and is held back until the exercise is answered. The cms
			 * writes an empty body for a zone nobody explained, which is whitespace rather than content once compiled.
			 */
			explanation: getChildrenElements(zone.props.children).length > 0 ? zone.props.children : undefined,
			label: zone.props.label ?? "",
			position: {
				height: zone.props.height ?? 20,
				width: zone.props.width ?? 25,
				x: zone.props.x ?? 0,
				y: zone.props.y ?? 0,
			},
			shape: zone.props.shape === "ellipse" ? "ellipse" : "rectangle",
		};
	});

	/**
	 * Every zone contributes the items which belong in it, and the distractors belong in none. They are ordered so the
	 * two are indistinguishable, and so the bank does not give away which zone an item was authored for.
	 */
	const items: Array<DropZoneItem> = [
		...dropZones.flatMap((zone, zoneIndex) =>
			toItems(zone.props.items).map((item, index) => {
				return { id: `item-${String(zoneIndex)}-${String(index)}`, label: item.label, zoneIndex };
			}),
		),
		...toItems(distractors).map((item, index) => {
			return { id: `distractor-${String(index)}`, label: item.label, zoneIndex: null };
		}),
		// oxlint-disable-next-line unicorn/no-array-sort
	].sort((a, b) => getSortKey(a.label) - getSortKey(b.label));

	/** The cms saves entries even when a required field was left empty, so an exercise nobody can solve is dropped. */
	if (zones.length === 0 || items.length === 0) {
		return null;
	}

	return (
		<QuizImageDropZonesForm
			alt={alt}
			question={question.length > 0 ? question : undefined}
			height={height}
			instantFeedback={instantFeedback}
			items={items}
			src={src}
			width={width}
			zones={zones}
		/>
	);
}

interface QuizImageDropZoneProps {
	/** Explains what belongs in this zone, and is revealed once the exercise has been answered. Optional. */
	children?: ReactNode;
	/** Percentages of the background image, used only when the exercise has one. */
	height?: number;
	/** The items which belong in this zone. See `toItems` for the shapes an author can write. */
	items?: Array<Item> | Array<string> | string;
	label?: string;
	/** An ellipse is inscribed in the same box as a rectangle, and only takes drops inside its outline. */
	shape?: "ellipse" | "rectangle";
	width?: number;
	x?: number;
	y?: number;
}

/** Read by the parent, which is why this renders nothing of its own - see the note on `QuizImageDropZones`. */
export function QuizImageDropZone(_props: Readonly<QuizImageDropZoneProps>): ReactNode {
	return null;
}
