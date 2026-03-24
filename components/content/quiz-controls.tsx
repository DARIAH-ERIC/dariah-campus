"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

import { useQuizContext } from "@/components/content/quiz";

interface QuizControlsProps {
	nextButtonLabel: string;
	previousButtonLabel: string;
	validateButtonLabel: string;
}

export function QuizControls(props: Readonly<QuizControlsProps>): ReactNode {
	const { nextButtonLabel, previousButtonLabel, validateButtonLabel } = props;

	const { navigation } = useQuizContext();

	return (
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
			className="inline-flex cursor-default items-center justify-center gap-x-2 rounded-md px-3 py-1.5 text-sm leading-normal font-medium whitespace-nowrap transition hover:bg-neutral-100 disabled:opacity-50 pressed:bg-neutral-200"
		>
			{children}
		</AriaButton>
	);
}
