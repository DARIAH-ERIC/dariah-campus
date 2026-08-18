"use client";

import { assert } from "@acdh-oeaw/lib";
import { type ReactNode, createContext, use, useState } from "react";

import { getChildrenElements } from "#/components/content/get-children-elements.ts";

export type QuizPageStatus = "correct" | "idle" | "incorrect" | "solved";

interface QuizContextValue {
	isCurrent: boolean;
	navigation: {
		hasNext: boolean;
		hasPrevious: boolean;
		isPaginated: boolean;
		next: () => void;
		previous: () => void;
	};
	setStatus: (status: QuizPageStatus) => void;
	status: QuizPageStatus;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function useQuizContext(): QuizContextValue {
	const value = use(QuizContext);
	assert(value != null);
	return value;
}

interface QuizProps {
	children: ReactNode;
}

export function Quiz(props: Readonly<QuizProps>): ReactNode {
	const { children } = props;

	const quizzes = getChildrenElements(children);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [statuses, setStatuses] = useState<Array<QuizPageStatus>>(() => 
		quizzes.map(() => 
			"idle"
		)
	);

	if (quizzes.length === 0) {return null;}

	const navigation: QuizContextValue["navigation"] = {
		hasNext: currentIndex < quizzes.length - 1,
		hasPrevious: currentIndex > 0,
		isPaginated: quizzes.length > 1,
		next() {
			setCurrentIndex((currentIndex) => 
				currentIndex + 1
			);
		},
		previous() {
			setCurrentIndex((currentIndex) => 
				currentIndex - 1
			);
		},
	};

	return (
		<aside>
			{quizzes.map((quiz, index) => {
				const isCurrent = index === currentIndex;
				const status = statuses[index] ?? "idle";
				const value: QuizContextValue = {
					isCurrent,
					navigation,
					setStatus(status) {
						setStatuses((statuses) => 
							statuses.map((currentStatus, statusIndex) => 
								statusIndex === index ? status : currentStatus
							)
						);
					},
					status,
				};

				return (
					<QuizContext key={index} value={value}>
						{quiz}
					</QuizContext>
				);
			})}
		</aside>
	);
}

interface QuizErrorMessageProps {
	children: ReactNode;
}

export function QuizErrorMessage(props: Readonly<QuizErrorMessageProps>): ReactNode {
	const { children } = props;

	return children;
}

interface QuizSuccessMessageProps {
	children: ReactNode;
}

export function QuizSuccessMessage(props: Readonly<QuizSuccessMessageProps>): ReactNode {
	const { children } = props;

	return children;
}
