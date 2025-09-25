import cn from "clsx/lite";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import type { FigureAlignment } from "@/lib/content/options";

interface FigureProps {
	/** @default "stretch" */
	alignment?: FigureAlignment;
	alt?: string;
	children: ReactNode;
	/** Maybe added by `with-image-sizes` mdx plugin. */
	height?: number;
	src: string;
	/** Maybe added by `with-image-sizes` mdx plugin. */
	width?: number;
}

export function Figure(props: Readonly<FigureProps>): ReactNode {
	const { alignment = "stretch", alt = "", children, height, src, width } = props;

	return (
		<figure
			className={cn(
				"flex flex-col",
				alignment === "center" ? "justify-center" : undefined,
				alignment === "left"
					? "inline-block sm:float-left sm:my-0 sm:me-4"
					: alignment === "right"
						? "inline-block sm:float-right sm:my-0 sm:ms-4"
						: undefined,
			)}
		>
			<Image alt={alt} height={height} src={src} width={width} />
			<figcaption
				className={cn(["left", "right"].includes(alignment) ? "sm:contain-inline-size" : undefined)}
			>
				{children}
			</figcaption>
		</figure>
	);
}
