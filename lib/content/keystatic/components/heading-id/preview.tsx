import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

interface HeadingIdPreviewProps {
	children: ReactNode;
}

export function HeadingIdPreview(props: Readonly<HeadingIdPreviewProps>): ReactNode {
	const { children } = props;

	return (
		<NotEditable className="inline">
			<span className="border-neutral-200 bg-neutral-100 px-2 text-neutral-700 opacity-50">
				{"#"}
				{children}
			</span>
		</NotEditable>
	);
}
