/* eslint-disable react/jsx-no-literals */

import type { ReactNode } from "react";

interface DiagramPreviewProps {
	children: ReactNode;
}

export function DiagramPreview(props: Readonly<DiagramPreviewProps>): ReactNode {
	const { children } = props;

	return <figure>{children}</figure>;
}

interface DiagramCaptionPreviewProps {
	children: ReactNode;
}

export function DiagramCaptionPreview(props: Readonly<DiagramCaptionPreviewProps>): ReactNode {
	const { children } = props;

	return <figcaption className="text-sm">{children}</figcaption>;
}

interface DiagramCodeBlockPreviewProps {
	children: ReactNode;
}

export function DiagramCodeBlockPreview(props: Readonly<DiagramCodeBlockPreviewProps>): ReactNode {
	const { children } = props;

	return (
		<div className="flex flex-col gap-y-1">
			<div className="text-sm italic">
				See the{" "}
				<a href="https://mermaid.js.org/config/accessibility.html" target="_blank">
					Mermaid documentation
				</a>{" "}
				to learn how to describe the diagram for assistive technology.
			</div>
			{children}
		</div>
	);
}
