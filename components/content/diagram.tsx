import type { ReactNode } from "react";

interface DiagramProps {
	children: ReactNode;
}

export function Diagram(props: Readonly<DiagramProps>): ReactNode {
	const { children } = props;

	return <figure className="flex flex-col">{children}</figure>;
}

interface DiagramCodeBlockProps {
	children: ReactNode;
}

export function DiagramCodeBlock(props: Readonly<DiagramCodeBlockProps>): ReactNode {
	const { children } = props;

	return <div className="rounded-lg border border-neutral-200 px-2">{children}</div>;
}

interface DiagramCaptionProps {
	children: ReactNode;
}

export function DiagramCaption(props: Readonly<DiagramCaptionProps>): ReactNode {
	const { children } = props;

	return <figcaption>{children}</figcaption>;
}
