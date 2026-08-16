"use client";

import { getFormDataValues } from "@acdh-oeaw/lib";
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useId, useState } from "react";

import { getChildrenElements } from "@/components/content/get-children-elements";
import { QuizErrorMessage, QuizSuccessMessage } from "@/components/content/quiz";
import { QuizForm } from "@/components/content/quiz-form";
import { useQuizChildren } from "@/components/content/use-quiz-children";

interface QuizChoiceProps {
	buttonLabel?: string;
	children: ReactNode;
	variant: "multiple" | "single";
}

export function QuizChoice(props: Readonly<QuizChoiceProps>): ReactNode {
	const { buttonLabel, children, variant } = props;

	const t = useTranslations("content.QuizControls");
	const answerMessagePrefixId = useId();
	const [incorrectAnswerIndices, setIncorrectAnswerIndices] = useState<Set<number>>(() => {
		return new Set();
	});

	const get = useQuizChildren(children);
	const questions = get(QuizChoiceQuestion);
	const answers = get(QuizChoiceAnswer);
	const successMessages = get(QuizSuccessMessage);
	const errorMessages = get(QuizErrorMessage);

	const type = variant === "multiple" ? "checkbox" : "radio";

	function validate(formData: FormData) {
		const data = getFormDataValues(formData) as { checks: Array<"correct" | "incorrect"> } & (
			| { variant: "multiple"; checked: Array<string> }
			| { variant: "single"; checked: string }
		);

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		const checks = data.checks ?? [];
		const checked = new Set(data.variant === "single" ? [data.checked] : data.checked);

		const incorrectAnswerIndices = new Set<number>();
		checks.forEach((check, index) => {
			const shouldBeChecked = check === "correct";
			if (checked.has(String(index)) !== shouldBeChecked) incorrectAnswerIndices.add(index);
		});
		setIncorrectAnswerIndices(incorrectAnswerIndices);

		return incorrectAnswerIndices.size === 0;
	}

	return (
		<QuizForm
			errorMessages={errorMessages.length > 0 ? errorMessages : t("incorrect")}
			nextButtonLabel={t("next-question")}
			onReset={() => {
				setIncorrectAnswerIndices(new Set());
			}}
			previousButtonLabel={t("previous-question")}
			successMessages={successMessages.length > 0 ? successMessages : t("correct")}
			validate={validate}
			validateButtonLabel={buttonLabel ?? t("validate")}
		>
			<header className="text-base">{questions}</header>

			<input name="variant" type="hidden" value={variant} />
			<ul className="list-none pl-0 accent-brand-700" role="list">
				{answers.map((answer, index) => {
					const answerChildren = getChildrenElements(answer.props.children);
					const labels = answerChildren.filter((child) => {
						return child.type === QuizChoiceAnswerLabel;
					});
					const errorMessages = answerChildren.filter((child) => {
						return child.type === QuizChoiceAnswerErrorMessage;
					});
					const isIncorrect = incorrectAnswerIndices.has(index);
					const errorMessageId = `${answerMessagePrefixId}-answer-${String(index)}`;
					const hasErrorMessage = errorMessages.length > 0;

					return (
						<li key={index} className="grid gap-y-1">
							<label className="grid grid-cols-[auto_1fr] items-start gap-x-3">
								<input name={`checks.${String(index)}`} type="hidden" value={answer.props.kind} />
								<input
									aria-describedby={isIncorrect && hasErrorMessage ? errorMessageId : undefined}
									aria-invalid={isIncorrect || undefined}
									name={variant === "single" ? "checked" : `checked.${String(index)}`}
									type={type}
									value={index}
								/>
								<span>{labels}</span>
							</label>
							{isIncorrect && hasErrorMessage ? (
								<div className="ml-7 flex items-start gap-x-2 text-error-600" id={errorMessageId}>
									<AlertCircleIcon aria-hidden={true} className="mt-1 size-4 shrink-0" />
									<div>{errorMessages}</div>
								</div>
							) : null}
						</li>
					);
				})}
			</ul>
		</QuizForm>
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

export function QuizChoiceAnswerErrorMessage(
	props: Readonly<QuizChoiceAnswerErrorMessageProps>,
): ReactNode {
	const { children } = props;

	return children;
}
