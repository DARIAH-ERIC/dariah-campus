"use client";

import { assert } from "@acdh-oeaw/lib";
import { createContext, type ReactNode, use, useState } from "react";

import { getChildrenElements } from "@/components/content/get-children-elements";

interface QuizContextValue {
	isCurrent: boolean;
	navigation: {
		hasNext: boolean;
		hasPrevious: boolean;
		next: () => void;
		previous: () => void;
	};
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

	const value: Omit<QuizContextValue, "isCurrent"> = {
		navigation: {
			hasNext: currentIndex < quizzes.length - 1,
			hasPrevious: currentIndex > 0,
			next() {
				setCurrentIndex((currentIndex) => {
					return currentIndex + 1;
				});
			},
			previous() {
				setCurrentIndex((currentIndex) => {
					return currentIndex - 1;
				});
			},
		},
	};

	return (
		<aside>
			{quizzes.map((quiz, index) => {
				const isCurrent = index === currentIndex;

				return (
					<QuizContext key={index} value={{ ...value, isCurrent }}>
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
