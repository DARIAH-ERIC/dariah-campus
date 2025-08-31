import cn from "clsx/lite";
import type { ComponentProps, ReactNode } from "react";

interface MainProps extends ComponentProps<"main"> {
	children: ReactNode;
}

export function Main(props: Readonly<MainProps>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<main {...rest} className={cn("outline-hidden", className)} tabIndex={-1}>
			{children}
		</main>
	);
}
