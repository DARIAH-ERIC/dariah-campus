import { isNonEmptyString } from "@acdh-oeaw/lib";
import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

import type { VideoProvider } from "@/lib/content/options";
import { createVideoUrl } from "@/lib/navigation/create-video-url";

interface VideoPreviewProps {
	children?: ReactNode;
	id: string;
	provider: VideoProvider;
	startTime?: number | null;
}

export function VideoPreview(props: Readonly<VideoPreviewProps>): ReactNode {
	const { children, id, provider, startTime } = props;

	const href = isNonEmptyString(id) ? String(createVideoUrl(provider, id, startTime)) : null;

	return (
		<figure className="grid gap-y-2">
			<NotEditable>
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
			</NotEditable>
			<figcaption className="text-sm">{children}</figcaption>
		</figure>
	);
}
