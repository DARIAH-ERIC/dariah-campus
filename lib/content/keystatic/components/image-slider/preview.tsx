import { useObjectUrl, type UseObjectUrlParams } from "@acdh-oeaw/keystatic-lib/preview";
import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

interface ImageSliderPreviewProps {
	children?: ReactNode;
	left: UseObjectUrlParams | null;
	right: UseObjectUrlParams | null;
}

export function ImageSliderPreview(props: Readonly<ImageSliderPreviewProps>): ReactNode {
	const { children, left, right } = props;

	const leftUrl = useObjectUrl(left);
	const rightUrl = useObjectUrl(right);

	return (
		<figure className="grid gap-y-2">
			<NotEditable>
				{leftUrl != null ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						alt=""
						className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white"
						src={leftUrl}
					/>
				) : null}
				{rightUrl != null ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						alt=""
						className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white"
						src={rightUrl}
					/>
				) : null}
			</NotEditable>
			<figcaption className="text-sm">{children}</figcaption>
		</figure>
	);
}
