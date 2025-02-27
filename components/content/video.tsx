import type { ReactNode } from "react";

import type { VideoProvider } from "@/lib/content/options";
import { createVideoUrl } from "@/lib/navigation/create-video-url";

interface VideoProps {
	children?: ReactNode;
	id: string;
	provider: VideoProvider;
	startTime?: number | null;
	/** Added by `with-iframe-titles` mdx plugin. */
	title?: string;
}

export function Video(props: Readonly<VideoProps>): ReactNode {
	const { children, id, provider, startTime, title } = props;

	const src = String(createVideoUrl(provider, id, startTime));

	return (
		<figure className="grid gap-y-2">
			<iframe
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen={true}
				className="aspect-video w-full overflow-hidden rounded-lg border border-neutral-200"
				loading="lazy"
				src={src}
				title={title}
			/>
			{children ? <figcaption>{children}</figcaption> : null}
		</figure>
	);
}
