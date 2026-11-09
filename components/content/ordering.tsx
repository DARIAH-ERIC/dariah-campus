import type { ReactNode } from "react";

import { getChildrenByType } from "#/components/content/get-children-by-type.ts";
import { getChildrenElements } from "#/components/content/get-children-elements.ts";
import { getScrambledOrder } from "#/components/content/get-scrambled-order.ts";
import { type OrderingItem, QuizOrderingForm } from "#/components/content/ordering-form.tsx";
import { QuizQuestion } from "#/components/content/quiz-question.tsx";

interface QuizOrderingProps {
	children: ReactNode;
	/** Mark each item as in or out of place as soon as it is moved. */
	instantFeedback?: boolean;
}

/**
 * Note that this must stay a server component: it identifies its children by comparing `child.type`, which only works
 * while the mdx components and the imports here resolve to the same objects. In a client component the children arrive
 * as separate lazy references, and nothing matches.
 */
export function QuizOrdering(props: Readonly<QuizOrderingProps>): ReactNode {
	const { children, instantFeedback = false } = props;

	const get = getChildrenByType(children);
	const question = get(QuizQuestion);

	/** The items in the order they were authored, which is the solution. */
	const items: Array<OrderingItem> = get(QuizOrderingItem)
		.map((item, index) => {
			return {
				/**
				 * Whatever the item wraps explains it, and is held back until the exercise is answered. The cms writes an empty
				 * body for an item nobody explained, which is whitespace rather than content once compiled.
				 */
				explanation: getChildrenElements(item.props.children).length > 0 ? item.props.children : undefined,
				id: `item-${String(index)}`,
				label: item.props.label?.trim() ?? "",
			};
		})
		/** The cms saves entries even when a required field was left empty, and a blank card cannot be put anywhere. */
		.filter((item) => item.label !== "");

	const initialOrder = getScrambledOrder(items.map((item) => item.label));

	/** One card cannot be put out of order, so an exercise with fewer than two is dropped. */
	if (items.length < 2) {
		return null;
	}

	return (
		<QuizOrderingForm
			initialOrder={initialOrder}
			instantFeedback={instantFeedback}
			items={items}
			question={question.length > 0 ? question : undefined}
		/>
	);
}

interface QuizOrderingItemProps {
	/** Explains the item, and is revealed once the exercise has been answered. Optional. */
	children?: ReactNode;
	/** The text on the card. */
	label?: string;
}

/** Read by the parent, which is why this renders nothing of its own - see the note on `QuizOrdering`. */
export function QuizOrderingItem(_props: Readonly<QuizOrderingItemProps>): ReactNode {
	return null;
}
