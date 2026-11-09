"use client";

import { AlertCircleIcon, CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

import { QuizControls } from "#/components/content/quiz-controls.tsx";
import { useQuizContext } from "#/components/content/quiz.tsx";

interface QuizFormProps {
	children: ReactNode;
	errorMessages: ReactNode;
	nextButtonLabel: string;
	onReset?: () => void;
	previousButtonLabel: string;
	successMessages: ReactNode;
	validate: (formData: FormData) => boolean;
	validateButtonLabel: string;
}

export function QuizForm(props: Readonly<QuizFormProps>): ReactNode {
	const {
		children,
		errorMessages,
		nextButtonLabel,
		onReset,
		previousButtonLabel,
		successMessages,
		validate,
		validateButtonLabel,
	} = props;

	const { isCurrent, setStatus, status } = useQuizContext();

	return (
		<section
			className="my-4 grid gap-y-4 rounded-md border border-neutral-200 bg-white px-4 py-6 text-sm/relaxed text-neutral-950 shadow-sm"
			hidden={!isCurrent}
		>
			<form
				onReset={() => {
					onReset?.();
					setStatus("idle");
				}}
				onSubmit={(event) => {
					/** Using `onSubmit` instead of `action` to avoid resetting checkboxes after submit. */
					event.preventDefault();

					const formData = new FormData(event.currentTarget);
					setStatus(validate(formData) ? "correct" : "incorrect");
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
						className={status === "idle" ? "sr-only" : status === "correct" ? "text-success-600" : "text-error-600"}
					>
						{status === "correct" ? (
							<div className="mbs-2 flex items-center gap-x-2">
								<CheckIcon aria-hidden={true} className="shrink-0 block-4 inline-4" /> {successMessages}
							</div>
						) : status === "incorrect" ? (
							<div className="mbs-2 flex items-center gap-x-2">
								<AlertCircleIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
								{errorMessages}
							</div>
						) : null}
					</div>
				</footer>
			</form>
		</section>
	);
}
