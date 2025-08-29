/* eslint-disable react/jsx-no-literals */

import type { ReactNode } from "react";

interface TableOfContentsPreviewProps {
	title?: string;
}

export function TableOfContentsPreview(props: Readonly<TableOfContentsPreviewProps>): ReactNode {
	const { title = "Table of contents" } = props;

	return (
		<div className="grid gap-y-2">
			<strong className="font-bold">{title}</strong>
			<div>Will be generated at build time.</div>
		</div>
	);
}
