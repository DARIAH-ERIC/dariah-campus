import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { getChildrenByType } from "#/components/content/get-children-by-type.ts";
import { QuizErrorMessage, QuizSuccessMessage } from "#/components/content/quiz.tsx";
import { type QuizChoiceAnswerData, QuizChoiceForm } from "#/components/content/quiz-choice-form.tsx";


interface QuizChoiceProps {
	buttonLabel?: string;
	children: ReactNode;
	variant: "multiple" | "single";
}

/**
 * Note that this must stay a server component: it identifies its children by comparing `child.type`, which
 * only works while the mdx components and the imports here resolve to the same objects. In a client
 * component the children arrive as separate lazy references, and nothing matches.
 */
export function QuizChoice(props: Readonly<QuizChoiceProps>): ReactNode {
	const { buttonLabel, children, variant } = props;

	const t = useTranslations("content.QuizControls");

	const get = getChildrenByType(children);
	const questions = get(QuizChoiceQuestion);
	const successMessages = get(QuizSuccessMessage);
	const errorMessages = get(QuizErrorMessage);

	const answers: Array<QuizChoiceAnswerData> = get(QuizChoiceAnswer).map((answer) => {
		const getAnswerChild = getChildrenByType(answer.props.children);
		const label = getAnswerChild(QuizChoiceAnswerLabel);
		const errorMessage = getAnswerChild(QuizChoiceAnswerErrorMessage);

		return {
			errorMessage,
			hasErrorMessage: errorMessage.length > 0,
			kind: answer.props.kind,
			label,
		};
	});

	return (
		<QuizChoiceForm
			answers={answers}
			errorMessages={errorMessages.length > 0 ? errorMessages : t("incorrect")}
			nextButtonLabel={t("next-question")}
			previousButtonLabel={t("previous-question")}
			questions={questions}
			successMessages={successMessages.length > 0 ? successMessages : t("correct")}
			validateButtonLabel={buttonLabel ?? t("validate")}
			variant={variant}
		/>
	);
}

interface QuizChoiceQuestionProps {
	children: ReactNode;
}

export function QuizChoiceQuestion(props: Readonly<QuizChoiceQuestionProps>): ReactNode {
	const { children } = props;

	return children;
}

interface QuizChoiceAnswerProps {
	children: ReactNode;
	kind: "correct" | "incorrect";
}

export function QuizChoiceAnswer(props: Readonly<QuizChoiceAnswerProps>): ReactNode {
	const { children } = props;

	return children;
}

interface QuizChoiceAnswerLabelProps {
	children: ReactNode;
}

export function QuizChoiceAnswerLabel(props: Readonly<QuizChoiceAnswerLabelProps>): ReactNode {
	const { children } = props;

	return children;
}

interface QuizChoiceAnswerErrorMessageProps {
	children: ReactNode;
}

export function QuizChoiceAnswerErrorMessage(props: Readonly<QuizChoiceAnswerErrorMessageProps>): ReactNode {
	const { children } = props;

	return children;
}
