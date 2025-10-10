"use client";

import type { ReactNode } from "react";

interface ImageSliderProps {
	children?: ReactNode;
	left: string;
	right: string;
}

export function ImageSlider(props: Readonly<ImageSliderProps>): ReactNode {
	const { children, left, right } = props;

	return (
		<figure className="flex flex-col">
			{"Image slider"}
			{children != null ? <figcaption>{children}</figcaption> : null}
		</figure>
	);
}
