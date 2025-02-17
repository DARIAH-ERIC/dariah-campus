"use client";

import { type ReactNode, useState } from "react";

import { LoadingIndicator } from "@/components/loading-indicator";
import type { VideoProvider } from "@/lib/content/options";
import { createVideoUrl } from "@/lib/keystatic/create-video-url";

interface VideoProps {
	caption: string;
	id: string;
	provider?: VideoProvider;
	startTime?: number;
}

export function Video(props: VideoProps): ReactNode {
	const { caption, id, provider = "youtube", startTime } = props;

	const [isLoading, setIsLoading] = useState(true);

	function onLoad() {
		setIsLoading(false);
	}

	const title = "Video player";

	const url = createVideoUrl(provider, id, startTime);

	return (
		<figure className="not-prose relative my-8 flex flex-col items-center justify-center">
			<div className="aspect-video w-full">
				{isLoading ? (
					<div className="absolute inset-0 flex flex-col items-center justify-center text-primary-600">
						<LoadingIndicator />
					</div>
				) : null}
				<iframe
					allow="autoplay; fullscreen; picture-in-picture"
					allowFullScreen={true}
					className="absolute inset-0 size-full object-cover"
					loading="lazy"
					onLoad={onLoad}
					src={String(url)}
					title={title}
				/>
			</div>
			<figcaption className="py-2 font-medium">{caption}</figcaption>
		</figure>
	);
}
