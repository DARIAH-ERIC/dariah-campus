import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import type { ActionState } from "@/lib/server/actions";

interface FormErrorMessageProps {
	children?: ReactNode | ((state: ActionState) => ReactNode);
	className?: string;
	state: ActionState;
}

export function FormErrorMessage(props: Readonly<FormErrorMessageProps>): ReactNode {
	const { children, className, state, ...rest } = props;

	// TODO: useRenderProps

	return (
		<div
			{...rest}
			aria-atomic={true}
			aria-live="assertive"
			className={cn(className, { "sr-only": state.status !== "error" })}
		>
			<div key={state.timestamp}>
				{state.status === "error"
					? children != null
						? typeof children === "function"
							? children(state)
							: children
						: state.message
					: null}
			</div>
		</div>
	);
}
