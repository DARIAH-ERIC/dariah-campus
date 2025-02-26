import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
	isDisabled?: boolean;
}

export function Card(props: CardProps): ReactNode {
	const { children, isDisabled } = props;

	return (
		<article
			className={cn(
				"relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md",
				isDisabled && "pointer-events-none opacity-50",
			)}
		>
			{children}
		</article>
	);
}

interface CardContentProps {
	children: ReactNode;
}

export function CardContent(props: CardContentProps): ReactNode {
	const { children } = props;

	return <div className="flex flex-col gap-y-5 p-10">{children}</div>;
}

interface CardTitleProps {
	children: ReactNode;
}

export function CardTitle(props: CardTitleProps): ReactNode {
	const { children } = props;

	return <h2 className="text-2xl font-bold">{children}</h2>;
}

interface CardFooterProps {
	children: ReactNode;
}

export function CardFooter(props: CardFooterProps): ReactNode {
	const { children } = props;

	return (
		<footer className="flex h-20 items-center justify-between border-t border-neutral-200 bg-neutral-100 px-10 py-5">
			{children}
		</footer>
	);
}
