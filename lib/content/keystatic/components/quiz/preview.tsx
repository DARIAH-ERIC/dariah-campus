import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

export {
	QuizImageHotspotEditor,
	QuizImageHotspotsPreview,
} from "#/lib/content/keystatic/components/quiz/image-hotspots-preview.tsx";

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

interface QuizChoiceAnswerLabelPreviewProps {
	children: ReactNode;
}

export function QuizChoiceAnswerLabelPreview(props: Readonly<QuizChoiceAnswerLabelPreviewProps>): ReactNode {
	const { children } = props;

	return (
		<div>
			<NotEditable>Answer text:</NotEditable>
			{children}
		</div>
	);
}

interface QuizChoiceAnswerErrorMessagePreviewProps {
	children: ReactNode;
}

export function QuizChoiceAnswerErrorMessagePreview(
	props: Readonly<QuizChoiceAnswerErrorMessagePreviewProps>,
): ReactNode {
	const { children } = props;

	return (
		<div>
			<NotEditable>Error message:</NotEditable>
			{children}
		</div>
	);
}

interface QuizChoiceQuestionPreviewProps {
	children: ReactNode;
}

export function QuizChoiceQuestionPreview(props: Readonly<QuizChoiceQuestionPreviewProps>): ReactNode {
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

export function QuizSuccessMessagePreview(props: Readonly<QuizSuccessMessagePreviewProps>): ReactNode {
	const { children } = props;

	return children;
}
