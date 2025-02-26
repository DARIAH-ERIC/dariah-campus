import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

export const id = "main-content";

interface MainContentProps {
	children: ReactNode;
	className?: string;
}

export function MainContent(props: Readonly<MainContentProps>): ReactNode {
	const { children, className } = props;

	return (
		<main className={cn("outline-none", className)} id={id} tabIndex={-1}>
			{children}
		</main>
	);
}
