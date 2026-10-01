import type { ReactNode } from "react";

import { getChildrenByType } from "#/components/content/get-children-by-type.ts";
import { getChildrenElements } from "#/components/content/get-children-elements.ts";
import { type ItemsInput, getDropZoneItems } from "#/components/content/get-drop-zone-items.ts";
import { getScrambledOrder } from "#/components/content/get-scrambled-order.ts";
import { type MatchingZone, QuizMatchingForm } from "#/components/content/matching-form.tsx";
import { QuizQuestion } from "#/components/content/quiz-question.tsx";

interface QuizMatchingProps {
	children: ReactNode;
	/**
	 * Decoy items that join the bank but belong in no zone, so the exercise cannot be solved by elimination. Leaving them
	 * in the bank is part of the correct answer.
	 */
	distractors?: ItemsInput;
	/** Mark each item right or wrong as soon as it lands in a zone. */
	instantFeedback?: boolean;
	/**
	 * Present the zones out of order, and make putting them back into the authored order part of the correct answer - for
	 * an exercise which tests both what belongs together and what comes first.
	 */
	orderedZones?: boolean;
}

/**
 * Note that this must stay a server component: it identifies its children by comparing `child.type`, which only works
 * while the mdx components and the imports here resolve to the same objects. In a client component the children arrive
 * as separate lazy references, and nothing matches.
 */
export function QuizMatching(props: Readonly<QuizMatchingProps>): ReactNode {
	const { children, distractors, instantFeedback = false, orderedZones = false } = props;

	const get = getChildrenByType(children);
	const matchingZones = get(QuizMatchingZone);
	const question = get(QuizQuestion);

	/** The zones in the order they were authored, which - when the order matters - is the solution. */
	const zones: Array<MatchingZone> = matchingZones.map((zone) => {
		return {
			/**
			 * Whatever the zone wraps explains what belongs in it, and is held back until the exercise is answered. The cms
			 * writes an empty body for a zone nobody explained, which is whitespace rather than content once compiled.
			 */
			explanation: getChildrenElements(zone.props.children).length > 0 ? zone.props.children : undefined,
			label: zone.props.label ?? "",
		};
	});

	const items = getDropZoneItems(
		matchingZones.map((zone) => zone.props.items),
		distractors,
	);

	/** The cms saves entries even when a required field was left empty, so an exercise nobody can solve is dropped. */
	if (zones.length === 0 || items.length === 0) {
		return null;
	}

	/** One zone cannot be out of order, so the sequence is only part of the answer when there is something to sequence. */
	const isOrdered = orderedZones && zones.length > 1;

	return (
		<QuizMatchingForm
			initialZoneOrder={isOrdered ? getScrambledOrder(zones.map((zone) => zone.label)) : null}
			instantFeedback={instantFeedback}
			items={items}
			question={question.length > 0 ? question : undefined}
			zones={zones}
		/>
	);
}

interface QuizMatchingZoneProps {
	/** Explains what belongs in this zone, and is revealed once the exercise has been answered. Optional. */
	children?: ReactNode;
	/** The items which belong in this zone. See `toItems` for the shapes an author can write. */
	items?: ItemsInput;
	label?: string;
}

/** Read by the parent, which is why this renders nothing of its own - see the note on `QuizMatching`. */
export function QuizMatchingZone(_props: Readonly<QuizMatchingZoneProps>): ReactNode {
	return null;
}
