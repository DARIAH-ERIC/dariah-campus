import { clsx as cn } from "clsx";
import { type ReactNode } from "react";

import { ResponsiveImage } from "@/common/ResponsiveImage";

export interface FigureProps {
	alignment?: "center" | "stretch"
	src: string;
	alt?: string;
	children?: ReactNode;
	width?: number;
	height?: number;
	blurDataURL?: string;
	placeholder?: "blur";
}

export function Figure(props: FigureProps): JSX.Element {
	const { alignment, src, alt = "", children: caption, width, height, blurDataURL, placeholder } = props;

	return (
		<figure className={cn("flex flex-col", alignment === "center" ? "items-center":null)}>
			{width == null || height == null ? (
				/** CMS preview cannot provide width/height for images which have not been saved yet. */

				<img src={src} alt={alt} className="w-full" />
			) : (
				<ResponsiveImage
					src={{ src, width, height, blurDataURL }}
					alt={alt}
					blurDataURL={blurDataURL}
					placeholder={placeholder}
				/>
			)}
			{caption != null ? <figcaption>{caption}</figcaption> : null}
		</figure>
	);
}
