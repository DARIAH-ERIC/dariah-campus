import type { ReactNode } from "react";

import { ServerImage as Image } from "@/components/server-image";

interface ServerImageProps {
	alt?: string;
	height?: number;
	src: string;
	width?: number;
}

export function ServerImage(props: ServerImageProps): ReactNode {
	const { alt = "", src } = props;

	return (
		<Image
			alt={alt}
			className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
			sizes="720px"
			src={src}
		/>
	);
}
