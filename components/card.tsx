import cn from "clsx/lite";
import type { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
	isDisabled?: boolean;
}

export function Card(props: Readonly<CardProps>): ReactNode {
	const { children, isDisabled } = props;

	return (
		<article
			className={cn(
				"relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md",
				isDisabled === true && "pointer-events-none opacity-50",
			)}
		>
			{children}
		</article>
	);
}

interface CardContentProps {
	children: ReactNode;
}

export function CardContent(props: Readonly<CardContentProps>): ReactNode {
	const { children } = props;

	return <div className="flex flex-col gap-y-5 p-10">{children}</div>;
}

interface CardTitleProps {
	children: ReactNode;
}

export function CardTitle(props: Readonly<CardTitleProps>): ReactNode {
	const { children } = props;

	return <h2 className="text-2xl font-bold">{children}</h2>;
}

interface CardFooterProps {
	children: ReactNode;
}

export function CardFooter(props: Readonly<CardFooterProps>): ReactNode {
	const { children } = props;

	return (
		<footer className="flex h-20 items-center justify-between border-t border-neutral-200 bg-neutral-100 px-10 py-5">
			{children}
		</footer>
	);
}
