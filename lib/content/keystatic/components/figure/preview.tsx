import { useObjectUrl, type UseObjectUrlParams } from "@acdh-oeaw/keystatic-lib/preview";
import { cn } from "@acdh-oeaw/style-variants";
import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

import type { FigureAlignment } from "@/lib/content/options";

interface FigurePreviewProps {
	/** @default "stretch" */
	alignment?: FigureAlignment;
	alt?: string;
	children?: ReactNode;
	src: UseObjectUrlParams | null;
}

export function FigurePreview(props: Readonly<FigurePreviewProps>): ReactNode {
	const { alignment = "stretch", alt = "", children, src } = props;

	const url = useObjectUrl(src);

	return (
		<figure className={cn("grid gap-y-2", alignment === "center" ? "justify-center" : undefined)}>
			<NotEditable>
				{url != null ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						alt={alt}
						className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white"
						src={url}
					/>
				) : null}
			</NotEditable>
			<figcaption className="text-sm">{children}</figcaption>
		</figure>
	);
}
