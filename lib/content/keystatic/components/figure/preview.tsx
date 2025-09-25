import { useObjectUrl, type UseObjectUrlParams } from "@acdh-oeaw/keystatic-lib/preview";
import { NotEditable } from "@keystatic/core";
import cn from "clsx/lite";
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
		<figure
			className={cn(
				"grid gap-y-2",
				alignment === "center" ? "justify-center" : undefined,
				alignment === "left"
					? "inline-block sm:float-left sm:my-0 sm:me-4"
					: alignment === "right"
						? "inline-block sm:float-right sm:my-0 sm:ms-4"
						: undefined,
			)}
		>
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
			<figcaption
				className={cn(
					"text-sm",
					["left", "right"].includes(alignment) ? "sm:contain-inline-size" : undefined,
				)}
			>
				{children}
			</figcaption>
		</figure>
	);
}
