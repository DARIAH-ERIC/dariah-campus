/* eslint-disable no-restricted-imports */
/* eslint-disable @next/next/no-img-element */

import NextImage, { getImageProps, type ImageProps as NextImageProps } from "next/image";
import type { ReactNode } from "react";

interface ImageProps extends Omit<NextImageProps, "loader"> {}

export function Image(props: Readonly<ImageProps>): ReactNode {
	const { alt = "", placeholder } = props;

	/** @see https://nextjs.org/docs/pages/api-reference/components/image#getimageprops */
	if (placeholder == null || placeholder === "empty") {
		return <img {...getImageProps(props).props} alt={alt} />;
	}

	return <NextImage {...props} alt={alt} />;
}
