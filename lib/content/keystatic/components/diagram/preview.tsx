/* eslint-disable react/jsx-no-literals */

import type { ReactNode } from "react";

interface DiagramPreviewProps {
	children: ReactNode;
	// eslint-disable-next-line @eslint-react/no-unused-props
	link: boolean;
}

export function DiagramPreview(props: Readonly<DiagramPreviewProps>): ReactNode {
	const { children } = props;

	return <figure>{children}</figure>;
}

interface DiagramCodeBlockPreviewProps {
	children: ReactNode;
}

export function DiagramCodeBlockPreview(props: Readonly<DiagramCodeBlockPreviewProps>): ReactNode {
	const { children } = props;

	return (
		<div className="flex flex-col gap-y-1">
			<div className="text-sm italic">
				<p>Insert a code block, and provide `mermaid` as language tag.</p>
				<p>
					See the{" "}
					<a href="https://mermaid.js.org/config/accessibility.html" target="_blank">
						Mermaid documentation
					</a>{" "}
					to learn how to describe the diagram for assistive technology.
				</p>
			</div>
			{children}
		</div>
	);
}

interface DiagramCaptionPreviewProps {
	children: ReactNode;
}

export function DiagramCaptionPreview(props: Readonly<DiagramCaptionPreviewProps>): ReactNode {
	const { children } = props;

	return <figcaption className="text-sm">{children}</figcaption>;
}
