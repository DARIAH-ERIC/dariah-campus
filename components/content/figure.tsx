import cn from "clsx/lite";
import type { ReactNode } from "react";

import { Image } from "#/components/image";
import type { FigureAlignment } from "#/lib/content/options";

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
	const figureStyles: Record<FigureAlignment, string | undefined> = {
		center: undefined,
		"left-one-fourth": "inline-block sm:float-left sm:my-0 sm:me-4 sm:w-1/4",
		"left-one-third": "inline-block sm:float-left sm:my-0 sm:me-4 sm:w-1/3",
		"left-one-half": "inline-block sm:float-left sm:my-0 sm:me-4 sm:w-1/2",
		"left-two-thirds": "inline-block sm:float-left sm:my-0 sm:me-4 sm:w-2/3",
		"right-one-fourth": "inline-block sm:float-right sm:my-0 sm:ms-4 sm:w-1/4",
		"right-one-third": "inline-block sm:float-right sm:my-0 sm:ms-4 sm:w-1/3",
		"right-one-half": "inline-block sm:float-right sm:my-0 sm:ms-4 sm:w-1/2",
		"right-two-thirds": "inline-block sm:float-right sm:my-0 sm:ms-4 sm:w-2/3",
		stretch: undefined,
	};
	const isFloating = alignment.startsWith("left") || alignment.startsWith("right");

	return (
		<figure
			className={cn("flex flex-col", alignment === "center" ? "justify-center" : undefined, figureStyles[alignment])}
		>
			<Image alt={alt} height={height} src={src} width={width} />
			<figcaption className={isFloating ? "sm:contain-inline-size" : undefined}>{children}</figcaption>
		</figure>
	);
}
