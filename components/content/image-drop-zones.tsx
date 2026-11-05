import type { ReactNode } from "react";

import { getChildrenByType } from "#/components/content/get-children-by-type.ts";
import { getChildrenElements } from "#/components/content/get-children-elements.ts";
import { type ItemsInput, getDropZoneItems } from "#/components/content/get-drop-zone-items.ts";
import { type DropZone, QuizImageDropZonesForm } from "#/components/content/image-drop-zones-form.tsx";
import { QuizQuestion } from "#/components/content/quiz-question.tsx";

interface QuizImageDropZonesProps {
	alt?: string;
	children: ReactNode;
	/**
	 * Decoy items that join the bank but belong in no zone, so the exercise cannot be solved by elimination. Leaving them
	 * in the bank is part of the correct answer.
	 */
	distractors?: ItemsInput;
	height?: number;
	/** Mark each item right or wrong as soon as it lands in a zone. */
	instantFeedback?: boolean;
	/** The image the zones are placed on. An exercise without one has nothing to position its zones against. */
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

	const items = getDropZoneItems(
		dropZones.map((zone) => zone.props.items),
		distractors,
	);

	/**
	 * The cms saves entries even when a required field was left empty, so an exercise nobody can solve is dropped. Zones
	 * which are not placed on an image belong in `QuizMatching`.
	 */
	if (src == null || zones.length === 0 || items.length === 0) {
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
	/** Percentages of the background image. */
	height?: number;
	/** The items which belong in this zone. See `toItems` for the shapes an author can write. */
	items?: ItemsInput;
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
