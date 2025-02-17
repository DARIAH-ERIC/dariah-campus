"use client";

import type { ReactNode } from "react";
import { Button } from "react-aria-components";

interface CitationCopyButtonProps {
	children: ReactNode;
	citation: string;
}

export function CitationCopyButton(props: CitationCopyButtonProps): ReactNode {
	const { children, citation } = props;

	return (
		<Button
			className="rounded-full border border-primary-600 px-3 py-1 text-xs font-medium text-primary-600 transition hover:bg-primary-600 hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
			onPress={() => {
				void navigator.clipboard.writeText(citation);
			}}
		>
			{children}
		</Button>
	);
}
