"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

import { useQuizContext } from "#/components/content/quiz.tsx";

interface QuizControlsProps {
	nextButtonLabel: string;
	onReset?: () => void;
	onShowSolution?: () => void;
	onValidate?: () => void;
	previousButtonLabel: string;
	resetButtonLabel?: string;
	showSolutionButtonLabel?: string;
	validateButtonLabel?: string;
}

export function QuizControls(props: Readonly<QuizControlsProps>): ReactNode {
	const {
		nextButtonLabel,
		onReset,
		onShowSolution,
		onValidate,
		previousButtonLabel,
		resetButtonLabel,
		showSolutionButtonLabel,
		validateButtonLabel,
	} = props;

	const { navigation } = useQuizContext();

	return (
		<div className={`flex items-center gap-x-4 ${navigation.isPaginated ? "justify-between" : "justify-center"}`}>
			{navigation.isPaginated ? (
				<Button
					aria-disabled={!navigation.hasPrevious || undefined}
					onPress={() => {
						if (!navigation.hasPrevious) {return;}

						navigation.previous();
					}}
				>
					<ChevronLeftIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
					<span>{previousButtonLabel}</span>
				</Button>
			) : null}

			<div className="flex flex-wrap items-center justify-center gap-2">
				{validateButtonLabel != null ? (
					<Button onPress={onValidate} type={onValidate == null ? "submit" : "button"}>
						<span>{validateButtonLabel}</span>
					</Button>
				) : null}
				{resetButtonLabel != null ? (
					<Button onPress={onReset} type="reset">
						<span>{resetButtonLabel}</span>
					</Button>
				) : null}
				{showSolutionButtonLabel != null ? (
					<Button onPress={onShowSolution} type="button">
						<span>{showSolutionButtonLabel}</span>
					</Button>
				) : null}
			</div>

			{navigation.isPaginated ? (
				<Button
					aria-disabled={!navigation.hasNext || undefined}
					onPress={() => {
						if (!navigation.hasNext) {return;}

						navigation.next();
					}}
				>
					<span>{nextButtonLabel}</span>
					<ChevronRightIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
				</Button>
			) : null}
		</div>
	);
}

interface ButtonProps extends AriaButtonProps {
	children: ReactNode;
}

function Button(props: Readonly<ButtonProps>): ReactNode {
	const { children } = props;

	return (
		<AriaButton
			{...props}
			className="inline-flex cursor-default items-center justify-center gap-x-2 rounded-md px-3 py-1.5 text-sm/normal font-medium whitespace-nowrap transition not-aria-disabled:hover:bg-neutral-100 aria-disabled:opacity-50 pressed:bg-neutral-200"
		>
			{children}
		</AriaButton>
	);
}
