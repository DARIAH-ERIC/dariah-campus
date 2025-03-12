import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { QuizForm, type QuizFormState } from "@/components/content/quiz-form";

interface QuizTextInputProps {
	children: ReactNode;
}

export function QuizTextInput(props: Readonly<QuizTextInputProps>): ReactNode {
	const { children } = props;

	const t = useTranslations("content.QuizControls");

	// eslint-disable-next-line @typescript-eslint/require-await
	async function validate(_state: QuizFormState | undefined, _formData: FormData) {
		"use server";

		return { status: "initial" as const };
	}

	return (
		<QuizForm
			errorMessages={[]}
			nextButtonLabel={t("next-question")}
			previousButtonLabel={t("previous-question")}
			successMessages={[]}
			validate={validate}
			validateButtonLabel={t("validate")}
		>
			<div className="mb-6">
				{children}

				<label>
					{/* eslint-disable-next-line react/jsx-no-literals */}
					<span className="sr-only">Input</span>
					<input className="w-full rounded-md border border-neutral-300 px-4 py-2" />
				</label>
			</div>
		</QuizForm>
	);
}
