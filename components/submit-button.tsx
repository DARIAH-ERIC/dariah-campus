"use client";

import type { ReactNode } from "react";
import { Button, type ButtonProps } from "react-aria-components";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps extends Omit<ButtonProps, "isPending"> {
	children: ReactNode;
}

export function SubmitButton(props: Readonly<SubmitButtonProps>): ReactNode {
	const { children, ...rest } = props;

	const { pending: isPending } = useFormStatus();

	return (
		<Button {...rest} isPending={isPending} type="submit">
			{children}
		</Button>
	);
}
