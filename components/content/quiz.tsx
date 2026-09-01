"use client";

import { assert } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import { type ReactNode, createContext, use, useEffect, useRef, useState } from "react";

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
	const [statuses, setStatuses] = useState<Array<QuizPageStatus>>(() => quizzes.map(() => "idle"));

	/**
	 * A quiz page is a page of a form, so navigating moves focus to the new page, like following a link does. Otherwise
	 * the new question sits _before_ the controls in the document, and keyboard users would have to tab backwards to
	 * reach it - and screen readers would not announce that anything changed.
	 */
	const pageRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
	/** Comparing against the previous page keeps focus untouched on the initial render. */
	const previousIndex = useRef(currentIndex);

	useEffect(() => {
		if (previousIndex.current !== currentIndex) {
			pageRefs.current.get(currentIndex)?.focus();
		}

		previousIndex.current = currentIndex;
	}, [currentIndex]);

	if (quizzes.length === 0) {
		return null;
	}

	const navigation: QuizContextValue["navigation"] = {
		hasNext: currentIndex < quizzes.length - 1,
		hasPrevious: currentIndex > 0,
		isPaginated: quizzes.length > 1,
		next() {
			setCurrentIndex((currentIndex) => currentIndex + 1);
		},
		previous() {
			setCurrentIndex((currentIndex) => currentIndex - 1);
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
							statuses.map((currentStatus, statusIndex) => (statusIndex === index ? status : currentStatus)),
						);
					},
					status,
				};

				return (
					// oxlint-disable-next-line react/jsx-no-constructed-context-values
					<QuizContext key={index} value={value}>
						{/** A quiz which is not paginated has nothing to navigate to, so it needs no group to focus. */}
						<div
							ref={(node) => {
								pageRefs.current.set(index, node);
							}}
							aria-label={
								navigation.isPaginated
									? t("page-label", { index: String(index + 1), total: String(quizzes.length) })
									: undefined
							}
							className={navigation.isPaginated ? "focus:outline-none" : undefined}
							hidden={!isCurrent}
							role={navigation.isPaginated ? "group" : undefined}
							tabIndex={navigation.isPaginated ? -1 : undefined}
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
