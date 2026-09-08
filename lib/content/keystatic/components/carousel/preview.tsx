import { type UseObjectUrlParams, useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

interface CarouselPreviewProps {
	children: ReactNode;
}

export function CarouselPreview(props: Readonly<CarouselPreviewProps>): ReactNode {
	const { children } = props;

	return <div className="grid gap-y-3">{children}</div>;
}

interface CarouselItemPreviewProps {
	alt?: string;
	children: ReactNode;
	src: UseObjectUrlParams | null;
}

export function CarouselItemPreview(props: Readonly<CarouselItemPreviewProps>): ReactNode {
	const { alt = "", children, src } = props;

	const url = useObjectUrl(src);

	return (
		<figure className="grid gap-y-2 rounded-sm border border-neutral-200 px-3 py-2 text-sm">
			<NotEditable>
				{url != null ? (
					// oxlint-disable-next-line @next/next/no-img-element
					<img
						alt={alt}
						className="mx-auto rounded-sm border border-neutral-200 bg-white object-contain max-block-64 max-inline-full"
						src={url}
					/>
				) : (
					<div className="grid place-items-center rounded-sm bg-neutral-100 py-6 text-neutral-500">No image</div>
				)}
			</NotEditable>
			<figcaption>{children}</figcaption>
		</figure>
	);
}
