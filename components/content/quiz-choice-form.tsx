"use client";

import { getFormDataValues } from "@acdh-oeaw/lib";
import { AlertCircleIcon } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

import { QuizForm } from "#/components/content/quiz-form.tsx";

export interface QuizChoiceAnswerData {
	errorMessage: ReactNode;
	/** Whether `errorMessage` has content, which cannot be determined from a `ReactNode`. */
	hasErrorMessage: boolean;
	kind: "correct" | "incorrect";
	label: ReactNode;
}

interface QuizChoiceFormProps {
	answers: Array<QuizChoiceAnswerData>;
	errorMessages: ReactNode;
	nextButtonLabel: string;
	previousButtonLabel: string;
	questions: ReactNode;
	successMessages: ReactNode;
	validateButtonLabel: string;
	variant: "multiple" | "single";
}

/**
 * The interactive half of `QuizChoice`. Splitting the answers out of the rich-text children happens in the server
 * component, so components can be identified by comparing `child.type`.
 */
export function QuizChoiceForm(props: Readonly<QuizChoiceFormProps>): ReactNode {
	const {
		answers,
		errorMessages,
		nextButtonLabel,
		previousButtonLabel,
		questions,
		successMessages,
		validateButtonLabel,
		variant,
	} = props;

	const answerMessagePrefixId = useId();
	const [incorrectAnswerIndices, setIncorrectAnswerIndices] = useState<Set<number>>(() => new Set());

	const type = variant === "multiple" ? "checkbox" : "radio";

	function validate(formData: FormData) {
		const data = getFormDataValues(formData) as { checks: Array<"correct" | "incorrect"> } & (
			| { variant: "multiple"; checked: Array<string> }
			| { variant: "single"; checked: string }
		);

		// oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
		const checks = data.checks ?? [];
		const checked = new Set(data.variant === "single" ? [data.checked] : data.checked);

		const incorrectAnswerIndices = new Set<number>();
		checks.forEach((check, index) => {
			const shouldBeChecked = check === "correct";
			if (checked.has(String(index)) !== shouldBeChecked) {
				incorrectAnswerIndices.add(index);
			}
		});
		setIncorrectAnswerIndices(incorrectAnswerIndices);

		return incorrectAnswerIndices.size === 0;
	}

	return (
		<QuizForm
			errorMessages={errorMessages}
			nextButtonLabel={nextButtonLabel}
			onReset={() => {
				setIncorrectAnswerIndices(new Set());
			}}
			previousButtonLabel={previousButtonLabel}
			successMessages={successMessages}
			validate={validate}
			validateButtonLabel={validateButtonLabel}
		>
			<header className="text-base">{questions}</header>

			<input name="variant" type="hidden" value={variant} />
			<ul className="list-none ps-0 accent-brand-700" role="list">
				{answers.map((answer, index) => {
					const isIncorrect = incorrectAnswerIndices.has(index);
					const errorMessageId = `${answerMessagePrefixId}-answer-${String(index)}`;

					return (
						<li key={index} className="grid gap-y-1">
							<label className="grid grid-cols-[auto_1fr] items-start gap-x-3">
								<input name={`checks.${String(index)}`} type="hidden" value={answer.kind} />
								<input
									aria-describedby={isIncorrect && answer.hasErrorMessage ? errorMessageId : undefined}
									aria-invalid={isIncorrect || undefined}
									name={variant === "single" ? "checked" : `checked.${String(index)}`}
									type={type}
									value={index}
								/>
								<span>{answer.label}</span>
							</label>
							{isIncorrect && answer.hasErrorMessage ? (
								<div className="ms-7 flex items-start gap-x-2 text-error-600" id={errorMessageId}>
									<AlertCircleIcon aria-hidden={true} className="mbs-1 shrink-0 block-4 inline-4" />
									<div>{answer.errorMessage}</div>
								</div>
							) : null}
						</li>
					);
				})}
			</ul>
		</QuizForm>
	);
}
