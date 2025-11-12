"use client";

import { createContext, type ReactNode, use, useMemo } from "react";

interface DiagramContextValue {
	link: boolean;
}

const DiagramContext = createContext<DiagramContextValue>({ link: false });

export function useDiagramContext(): DiagramContextValue {
	return use(DiagramContext);
}

interface DiagramProps {
	children: ReactNode;
	link: boolean;
}

export function Diagram(props: Readonly<DiagramProps>): ReactNode {
	const { children, link } = props;

	const value = useMemo(() => {
		return { link };
	}, [link]);

	return (
		<figure className="flex flex-col">
			<DiagramContext value={value}>{children}</DiagramContext>
		</figure>
	);
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
