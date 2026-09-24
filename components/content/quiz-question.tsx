import type { ReactNode } from "react";

interface QuizQuestionProps {
	children: ReactNode;
}

/**
 * The task an exercise sets, authored as content rather than as a field so it can carry links and emphasis. The
 * exercise it sits in picks it out of its children, which is why that has to happen in a server component - see the
 * note on `QuizImageDropZones`.
 */
export function QuizQuestion(props: Readonly<QuizQuestionProps>): ReactNode {
	const { children } = props;

	return children;
}
