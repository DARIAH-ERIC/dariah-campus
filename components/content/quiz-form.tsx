"use client";

import { AlertCircleIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type ReactNode, useActionState, useTransition } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

import { useQuizContext } from "@/components/content/quiz";

export interface QuizFormState {
	status: "correct" | "incorrect";
}

interface QuizFormProps {
	children: ReactNode;
	errorMessages: Array<ReactNode>;
	nextButtonLabel: string;
	previousButtonLabel: string;
	successMessages: Array<ReactNode>;
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

	const { isCurrent, navigation } = useQuizContext();
	const [formState, formAction] = useActionState(validate, undefined);
	const [_isPending, startTransition] = useTransition();

	return (
		<section
			className="my-4 grid gap-y-4 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-6 text-sm leading-relaxed text-neutral-950 shadow"
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
					<div className="flex items-center justify-between gap-x-4">
						<Button isDisabled={!navigation.hasPrevious} onPress={navigation.previous}>
							<ChevronLeftIcon aria-hidden={true} className="size-4 shrink-0" />
							<span>{previousButtonLabel}</span>
						</Button>

						<Button type="submit">
							<span>{validateButtonLabel}</span>
						</Button>

						<Button isDisabled={!navigation.hasNext} onPress={navigation.next}>
							<span>{nextButtonLabel}</span>
							<ChevronRightIcon aria-hidden={true} className="size-4 shrink-0" />
						</Button>
					</div>

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
							<div className="flex items-center gap-x-2">
								<CheckIcon aria-hidden={true} className="size-4 shrink-0" /> {successMessages}
							</div>
						) : formState?.status === "incorrect" ? (
							<div className="flex items-center gap-x-2">
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

interface ButtonProps extends AriaButtonProps {
	children: ReactNode;
}

function Button(props: ButtonProps): ReactNode {
	const { children } = props;

	return (
		<AriaButton
			{...props}
			className="inline-flex cursor-default items-center justify-center gap-x-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium leading-normal transition hover:bg-neutral-100 pressed:bg-neutral-200 disabled:opacity-50"
		>
			{children}
		</AriaButton>
	);
}
