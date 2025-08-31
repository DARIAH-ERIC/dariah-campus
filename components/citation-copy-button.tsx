"use client";

import type { ReactNode } from "react";
import { Button } from "react-aria-components";

interface CitationCopyButtonProps {
	children: ReactNode;
	citation: string;
}

export function CitationCopyButton(props: Readonly<CitationCopyButtonProps>): ReactNode {
	const { children, citation } = props;

	return (
		<Button
			className="rounded-full border border-brand-700 px-3 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-700 hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
			onPress={() => {
				void navigator.clipboard.writeText(citation);
			}}
		>
			{children}
		</Button>
	);
}
