import { type ImageProps } from "next/image";
import Image from "next/image";

export function ResponsiveImage(props: ImageProps): JSX.Element {
	if (typeof props.src === "string") {
		// @ts-expect-error It's fine.
		return <img alt="" {...props} src={props.src} />;
	}

	return <Image sizes="800px" className="object-contain" {...props} alt={props.alt} />;
}
