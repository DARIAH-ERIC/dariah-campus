import { type UseObjectUrlParams, useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { isNonEmptyString } from "@acdh-oeaw/lib";
import { NotEditable } from "@keystatic/core";
import { PlayCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { VideoProvider } from "#/lib/content/options.ts";
import { createVideoUrl } from "#/lib/navigation/create-video-url.ts";

interface VideoCardPreviewProps {
	id: string;
	provider: VideoProvider;
	src: UseObjectUrlParams | null;
	startTime?: number | null;
	subtitle?: string;
	title: string;
}

export function VideoCardPreview(props: Readonly<VideoCardPreviewProps>): ReactNode {
	const { id, provider, src, startTime, subtitle, title } = props;

	const href = isNonEmptyString(id) ? String(createVideoUrl(provider, id, startTime)) : null;
	const _src = useObjectUrl(src);

	return (
		<figure className="rounded-xl border border-neutral-200 bg-white text-neutral-800 shadow-md">
			<NotEditable className="grid gap-y-6 p-6">
				{href != null ? (
					// oxlint-disable-next-line jsx-a11y/iframe-has-title
					<iframe
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen={true}
						className="aspect-video overflow-hidden rounded-lg border border-neutral-200 inline-full"
						loading="lazy"
						src={href}
					/>
				) : null}
				<figcaption className="grid justify-center justify-items-center gap-y-1">
					<PlayCircleIcon aria-hidden={true} className="mx-auto shrink-0 text-brand-700 block-12 inline-12" />
					<strong className="text-xl font-bold">{title}</strong>
					<div className="text-sm text-neutral-500">{subtitle}</div>
				</figcaption>
			</NotEditable>
		</figure>
	);
}
