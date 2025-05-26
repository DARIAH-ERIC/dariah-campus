import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { ServerImage as Image } from "@/components/content/server-image";
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
		<figure className={cn("flex flex-col", alignment === "center" ? "justify-center" : undefined)}>
			<Image alt={alt} height={height} src={src} width={width} />
			<figcaption>{children}</figcaption>
		</figure>
	);
}
