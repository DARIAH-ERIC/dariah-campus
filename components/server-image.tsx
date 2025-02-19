/* eslint-disable no-restricted-imports */
/* eslint-disable @next/next/no-img-element */

import type { ImageProps as NextImageProps } from "next/image";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { getImageDimensions } from "@/lib/server/images/get-image-dimensions";

interface ServerImageProps extends Omit<NextImageProps, "loader"> {}

export async function ServerImage(props: Readonly<ServerImageProps>): Promise<ReactNode> {
	const {
		alt = "",
		decoding: _decoding,
		fill,
		height,
		loading: _loading,
		priority,
		src,
		width,
	} = props;

	const loading = _loading ?? (priority ? "eager" : "lazy");
	const decoding = _decoding ?? (priority || loading === "eager" ? "auto" : "async");

	const dimensions =
		typeof src === "object" || fill === true || (width != null && height != null)
			? { width, height }
			: /** Get image dimensions when not provided. */
				await getImageDimensions(src);

	if (dimensions == null) {
		return <img {...props} alt={alt} decoding={decoding} loading={loading} src={src as string} />;
	}

	return (
		<Image
			{...props}
			alt={alt}
			decoding={decoding}
			height={dimensions.height}
			loading={loading}
			priority={priority}
			width={dimensions.width}
		/>
	);
}
