import { type UseObjectUrlParams, useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { isNonEmptyString } from "@acdh-oeaw/lib";
import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

interface ImageLayersPreviewProps {
	children: ReactNode;
}

export function ImageLayersPreview(props: Readonly<ImageLayersPreviewProps>): ReactNode {
	const { children } = props;

	return <div className="grid gap-y-3 [counter-reset:image-layer]">{children}</div>;
}

interface ImageLayerPreviewProps {
	alt?: string;
	label?: string;
	src: UseObjectUrlParams | null;
}

export function ImageLayerPreview(props: Readonly<ImageLayerPreviewProps>): ReactNode {
	const { alt = "", label, src } = props;

	const url = useObjectUrl(src);

	return (
		<NotEditable>
			<figure className="grid gap-y-2 rounded-sm border border-neutral-200 px-3 py-2 text-sm [counter-increment:image-layer]">
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

				{isNonEmptyString(label) ? (
					<figcaption>{label}</figcaption>
				) : (
					/** The layer name is optional, and falls back to the layer position. */
					<figcaption className="text-neutral-500 after:[content:counter(image-layer)]">Layer&nbsp;</figcaption>
				)}
			</figure>
		</NotEditable>
	);
}
