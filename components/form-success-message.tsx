import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import type { ActionState } from "@/lib/server/actions";

interface FormSuccessMessageProps {
	children?: ReactNode | ((state: ActionState) => ReactNode);
	className?: string;
	state: ActionState;
}

export function FormSuccessMessage(props: Readonly<FormSuccessMessageProps>): ReactNode {
	const { children, className, state, ...rest } = props;

	// TODO: useRenderProps

	return (
		<div
			{...rest}
			aria-atomic={true}
			aria-live="polite"
			className={cn(className, { "sr-only": state.status !== "success" })}
		>
			<div key={state.timestamp}>
				{state.status === "success"
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
