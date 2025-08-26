import { useObjectUrl, type UseObjectUrlParams } from "@acdh-oeaw/keystatic-lib/preview";
import { isNonEmptyString } from "@acdh-oeaw/lib";
import { NotEditable } from "@keystatic/core";
import { PlayCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { VideoProvider } from "@/lib/content/options";
import { createVideoUrl } from "@/lib/navigation/create-video-url";

interface VideoCardPreviewProps {
	id: string;
	image: UseObjectUrlParams | null;
	provider: VideoProvider;
	startTime?: number | null;
	subtitle?: string;
	title: string;
}

export function VideoCardPreview(props: Readonly<VideoCardPreviewProps>): ReactNode {
	const { id, image, provider, startTime, subtitle, title } = props;

	const href = isNonEmptyString(id) ? String(createVideoUrl(provider, id, startTime)) : null;
	const _src = useObjectUrl(image);

	return (
		<figure className="rounded-xl border border-neutral-200 bg-white text-neutral-800 shadow-md">
			<NotEditable className="grid gap-y-6 p-6">
				{href != null ? (
					// eslint-disable-next-line jsx-a11y/iframe-has-title
					<iframe
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen={true}
						className="aspect-video w-full overflow-hidden rounded-lg border border-neutral-200"
						loading="lazy"
						src={href}
					/>
				) : null}
				<figcaption className="grid justify-center justify-items-center gap-y-1">
					<PlayCircleIcon aria-hidden={true} className="mx-auto size-12 shrink-0 text-brand-700" />
					<strong className="text-xl font-bold">{title}</strong>
					<div className="text-sm text-neutral-500">{subtitle}</div>
				</figcaption>
			</NotEditable>
		</figure>
	);
}
