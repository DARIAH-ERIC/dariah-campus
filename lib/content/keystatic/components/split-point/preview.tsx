import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

interface SplitPointPreviewProps {
	id: string;
}

export function SplitPointPreview(props: Readonly<SplitPointPreviewProps>): ReactNode {
	const { id } = props;

	return (
		<NotEditable className="flex items-center gap-x-3 text-neutral-500">
			<hr className="flex-1 border-bs-2 border-dashed border-neutral-300" />
			<span className="shrink-0 text-xs tracking-wide uppercase">{`Section: ${id}`}</span>
			<hr className="flex-1 border-bs-2 border-dashed border-neutral-300" />
		</NotEditable>
	);
}
