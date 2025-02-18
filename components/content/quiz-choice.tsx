import { getFormDataValues } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { QuizErrorMessage, QuizSuccessMessage } from "@/components/content/quiz";
import { QuizForm, type QuizFormState } from "@/components/content/quiz-form";
import { useQuizChildren } from "@/components/content/use-quiz-children";

interface QuizChoiceProps {
	buttonLabel?: string;
	children: ReactNode;
	variant: "multiple" | "single";
}

export function QuizChoice(props: Readonly<QuizChoiceProps>): ReactNode {
	const { buttonLabel, children, variant } = props;

	const t = useTranslations("content.QuizControls");

	const get = useQuizChildren(children);
	const questions = get(QuizChoiceQuestion);
	const answers = get(QuizChoiceAnswer);
	const successMessages = get(QuizSuccessMessage);
	const errorMessages = get(QuizErrorMessage);

	const type = variant === "multiple" ? "checkbox" : "radio";

	// eslint-disable-next-line @typescript-eslint/require-await
	async function validate(state: QuizFormState | undefined, formData: FormData) {
		"use server";

		const data = getFormDataValues(formData) as { checks: Array<"correct" | "incorrect"> } & (
			| { variant: "multiple"; checked: Array<string> }
			| { variant: "single"; checked: string }
		);

		const checks = data.checks;
		const checked = new Set(data.variant === "single" ? [data.checked] : data.checked);

		if (
			checks.every((check, index) => {
				if (check === "correct") return checked.has(String(index));
				return !checked.has(String(index));
			})
		) {
			return { status: "correct" as const };
		}

		return { status: "incorrect" as const };
	}

	return (
		<QuizForm
			errorMessages={errorMessages}
			nextButtonLabel={t("next-question")}
			previousButtonLabel={t("previous-question")}
			successMessages={successMessages}
			validate={validate}
			validateButtonLabel={buttonLabel ?? t("validate")}
		>
			<header>{questions}</header>

			<input name="variant" type="hidden" value={variant} />
			<ul className="list-none pl-0 accent-brand-700" role="list">
				{answers.map((answer, index) => {
					return (
						<li key={index}>
							<label className="grid grid-cols-[auto_1fr] items-center gap-x-2">
								<input name={`checks.${String(index)}`} type="hidden" value={answer.props.kind} />
								<input
									name={variant === "single" ? "checked" : `checked.${String(index)}`}
									type={type}
									value={index}
								/>
								<span>{answer}</span>
							</label>
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
