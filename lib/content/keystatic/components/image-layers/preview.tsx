import { type UseObjectUrlParams, useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

interface ImageLayersPreviewProps {
	children: ReactNode;
}

export function ImageLayersPreview(props: Readonly<ImageLayersPreviewProps>): ReactNode {
	const { children } = props;

	return <div className="grid gap-y-3">{children}</div>;
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
			<div className="flex items-center gap-x-3 rounded-sm border border-neutral-200 p-3 text-sm">
				{url != null ? (
					// oxlint-disable-next-line @next/next/no-img-element
					<img alt={alt} className="shrink-0 rounded-sm object-contain block-16 inline-16" src={url} />
				) : (
					<div className="grid shrink-0 place-items-center rounded-sm bg-neutral-100 text-neutral-500 block-16 inline-16">
						No image
					</div>
				)}
				<span>{label}</span>
			</div>
		</NotEditable>
	);
}
