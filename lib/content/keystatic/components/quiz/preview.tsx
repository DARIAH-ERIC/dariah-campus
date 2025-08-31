/* eslint-disable react/jsx-no-literals */

import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

interface QuizPreviewProps {
	children: ReactNode;
}

export function QuizPreview(props: Readonly<QuizPreviewProps>): ReactNode {
	const { children } = props;

	return children;
}

interface QuizChoicePreviewProps {
	buttonLabel?: string;
	children: ReactNode;
	variant: "single" | "multiple";
}

export function QuizChoicePreview(props: Readonly<QuizChoicePreviewProps>): ReactNode {
	const { children } = props;

	return children;
}

interface QuizChoiceAnswerPreviewProps {
	children: ReactNode;
	kind: "correct" | "incorrect";
}

export function QuizChoiceAnswerPreview(props: Readonly<QuizChoiceAnswerPreviewProps>): ReactNode {
	const { children, kind } = props;

	return (
		<div>
			<NotEditable>
				{}
				{kind === "correct" ? "Correct" : "Incorrect"} answer:
			</NotEditable>
			{children}
		</div>
	);
}

interface QuizChoiceQuestionPreviewProps {
	children: ReactNode;
}

export function QuizChoiceQuestionPreview(
	props: Readonly<QuizChoiceQuestionPreviewProps>,
): ReactNode {
	const { children } = props;

	return children;
}

interface QuizErrorMessagePreviewProps {
	children: ReactNode;
}

export function QuizErrorMessagePreview(props: Readonly<QuizErrorMessagePreviewProps>): ReactNode {
	const { children } = props;

	return children;
}

interface QuizSuccessMessagePreviewProps {
	children: ReactNode;
}

export function QuizSuccessMessagePreview(
	props: Readonly<QuizSuccessMessagePreviewProps>,
): ReactNode {
	const { children } = props;

	return children;
}

interface QuizTextInputPreviewProps {
	children: ReactNode;
}

export function QuizTextInputPreview(props: Readonly<QuizTextInputPreviewProps>): ReactNode {
	const { children } = props;

	return children;
}
