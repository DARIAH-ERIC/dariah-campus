import { useObjectUrl, type UseObjectUrlParams } from "@acdh-oeaw/keystatic-lib/preview";
import { NotEditable } from "@keystatic/core";
import cn from "clsx/lite";
import type { ReactNode } from "react";

import type { FigureAlignment } from "#/lib/content/options.ts";

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
	const figureStyles: Record<FigureAlignment, string | undefined> = {
		center: "justify-center",
		"left-one-fourth": "justify-start",
		"left-one-third": "justify-start",
		"left-one-half": "justify-start",
		"left-two-thirds": "justify-start",
		"right-one-fourth": "justify-end",
		"right-one-third": "justify-end",
		"right-one-half": "justify-end",
		"right-two-thirds": "justify-end",
		stretch: undefined,
	};

	return (
		<figure className={cn("grid gap-y-2", figureStyles[alignment])}>
			<NotEditable>
				{url != null ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img alt={alt} className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white" src={url} />
				) : null}
			</NotEditable>
			<figcaption>{children}</figcaption>
		</figure>
	);
}
