"use client";

import { assert } from "@acdh-oeaw/lib";
import { type ReactNode, createContext, use, useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

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

	const t = useTranslations("content.QuizControls");

	const quizzes = getChildrenElements(children);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [statuses, setStatuses] = useState<Array<QuizPageStatus>>(() =>
		quizzes.map(() =>
			"idle"
		)
	);

	/**
	 * A quiz page is a page of a form, so navigating moves focus to the new page, like following a link does.
	 * Otherwise the new question sits *before* the controls in the document, and keyboard users would have to
	 * tab backwards to reach it - and screen readers would not announce that anything changed.
	 */
	const pageRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
	/** Focus is only moved once a learner navigates, never on the initial render. */
	const hasNavigated = useRef(false);

	useEffect(() => {
		if (!hasNavigated.current) {return;}

		pageRefs.current.get(currentIndex)?.focus();
	}, [currentIndex]);

	if (quizzes.length === 0) {return null;}

	const navigation: QuizContextValue["navigation"] = {
		hasNext: currentIndex < quizzes.length - 1,
		hasPrevious: currentIndex > 0,
		isPaginated: quizzes.length > 1,
		next() {
			hasNavigated.current = true;
			setCurrentIndex((currentIndex) =>
				currentIndex + 1
			);
		},
		previous() {
			hasNavigated.current = true;
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
					// oxlint-disable-next-line react/jsx-no-constructed-context-values
					<QuizContext key={index} value={value}>
						<div
							ref={(node) => {
								pageRefs.current.set(index, node);
							}}
							aria-label={t("page-label", {
								index: String(index + 1),
								total: String(quizzes.length),
							})}
							className="focus:outline-none"
							hidden={!isCurrent}
							role="group"
							tabIndex={-1}
						>
							{quiz}
						</div>
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
