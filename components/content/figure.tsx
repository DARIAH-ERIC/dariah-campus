import cn from "clsx/lite";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import type { FigureAlignment } from "@/lib/content/options";

interface FigureProps {
	/** @default "stretch" */
	alignment?: FigureAlignment;
	alt?: string;
	children?: ReactNode;
	/** Maybe added by `with-image-sizes` mdx plugin. */
	height?: number;
	src: string;
	/** Maybe added by `with-image-sizes` mdx plugin. */
	width?: number;
}

export function Figure(props: Readonly<FigureProps>): ReactNode {
	const { alignment = "stretch", alt = "", children, height, src, width } = props;
	const figureWidths = {
		"right-one-fourth": "sm:w-1/4",
		"right-one-third": "sm:w-1/3",
		"right-one-half": "sm:w-1/2",
		"right-two-thirds": "sm:w-2/3",
		center: "",
		stretch: "",
	};

	return (
		<figure
			className={cn(
				"flex flex-col",
				alignment === "center" ? "justify-center" : undefined,
				alignment.includes("right")
					? `inline-block sm:float-right sm:my-0 sm:ms-4 ${figureWidths[alignment]}`
					: undefined,
			)}
		>
			<Image alt={alt} height={height} src={src} width={width} />
			{children != null && children !== "" ? (
				<figcaption className={alignment.includes("right") ? "sm:contain-inline-size" : undefined}>
					{children}
				</figcaption>
			) : null}
		</figure>
	);
}
