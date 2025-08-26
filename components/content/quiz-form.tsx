"use client";

import { AlertCircleIcon, CheckIcon } from "lucide-react";
import { type ReactNode, useActionState, useTransition } from "react";

import { useQuizContext } from "@/components/content/quiz";
import { QuizControls } from "@/components/content/quiz-controls";

export interface QuizFormState {
	status: "initial" | "correct" | "incorrect";
}

interface QuizFormProps {
	children: ReactNode;
	errorMessages: ReactNode;
	nextButtonLabel: string;
	previousButtonLabel: string;
	successMessages: ReactNode;
	validate: (formState: QuizFormState | undefined, formData: FormData) => Promise<QuizFormState>;
	validateButtonLabel: string;
}

export function QuizForm(props: Readonly<QuizFormProps>): ReactNode {
	const {
		children,
		errorMessages,
		nextButtonLabel,
		previousButtonLabel,
		successMessages,
		validate,
		validateButtonLabel,
	} = props;

	const { isCurrent } = useQuizContext();
	const [formState, formAction] = useActionState(validate, undefined);
	const [_isPending, startTransition] = useTransition();

	return (
		<section
			className="my-4 grid gap-y-4 rounded-md border border-neutral-200  bg-white px-4 py-6 text-sm leading-relaxed text-neutral-950 shadow"
			hidden={!isCurrent}
		>
			<form
				onSubmit={(event) => {
					/** Using `onSubmit` instead of `action` to avoid resetting checkboxes after submit. */
					event.preventDefault();

					const formData = new FormData(event.currentTarget as HTMLFormElement);
					startTransition(() => {
						formAction(formData);
					});
				}}
			>
				{children}

				<footer>
					<QuizControls
						nextButtonLabel={nextButtonLabel}
						previousButtonLabel={previousButtonLabel}
						validateButtonLabel={validateButtonLabel}
					/>

					<div
						aria-live="polite"
						className={
							formState == null
								? "sr-only"
								: formState.status === "correct"
									? "text-success-600"
									: "text-error-600"
						}
					>
						{formState?.status === "correct" ? (
							<div className="mt-2 flex items-center gap-x-2">
								<CheckIcon aria-hidden={true} className="size-4 shrink-0" /> {successMessages}
							</div>
						) : formState?.status === "incorrect" ? (
							<div className="mt-2 flex items-center gap-x-2">
								<AlertCircleIcon aria-hidden={true} className="size-4 shrink-0" />
								{errorMessages}
							</div>
						) : null}
					</div>
				</footer>
			</form>
		</section>
	);
}
