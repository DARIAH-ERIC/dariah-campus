import type { ReactNode } from "react";

import { getChildrenElements } from "#/components/content/get-children-elements.ts";
import { type HotspotPresentation, QuizImageHotspotsView } from "#/components/content/quiz-image-hotspots-view.tsx";
import { QuizQuestion } from "#/components/content/quiz-question.tsx";

export { QuizImageHotspot } from "#/components/content/quiz-image-hotspots-view.tsx";

interface QuizImageHotspotsProps {
	alt?: string;
	children: ReactNode;
	height?: number;
	presentation?: HotspotPresentation;
	src: string;
	width?: number;
}

/**
 * Note that this must stay a server component: it picks the question out of its children by comparing `child.type`,
 * which only works while the mdx components and the imports here resolve to the same objects. In a client component the
 * children arrive as separate lazy references, and nothing matches.
 */
export function QuizImageHotspots(props: Readonly<QuizImageHotspotsProps>): ReactNode {
	const { children, ...rest } = props;

	const elements = getChildrenElements(children);
	const question = elements.filter((child) => child.type === QuizQuestion);
	/** Everything else passes through untouched, so the hotspots keep the order they are numbered by. */
	const hotspots = elements.filter((child) => child.type !== QuizQuestion);

	return (
		<QuizImageHotspotsView {...rest} question={question.length > 0 ? question : undefined}>
			{hotspots}
		</QuizImageHotspotsView>
	);
}
