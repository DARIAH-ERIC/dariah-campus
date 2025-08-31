import type { ParsedValueForComponentSchema } from "@keystatic/core";
import type { ReactNode } from "react";

import type { createLinkSchema } from "@/lib/content/keystatic/utils/create-link-schema";

type LinkSchema = ParsedValueForComponentSchema<ReturnType<typeof createLinkSchema>>;

interface LinkButtonPreviewProps {
	children: ReactNode;
	link: LinkSchema;
}

export function LinkButtonPreview(props: Readonly<LinkButtonPreviewProps>): ReactNode {
	const { children, link: _link } = props;

	return (
		<div className="inline-flex rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white select-none">
			{children}
		</div>
	);
}
