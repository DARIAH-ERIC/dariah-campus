import { PlayCircleIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { LightBox, LightBoxOverlay, LightboxTrigger } from "@/components/content/lightbox";
import { Image } from "@/components/image";
import type { VideoProvider } from "@/lib/content/options";
import { createVideoUrl } from "@/lib/navigation/create-video-url";

interface VideoCardProps {
	description: string;
	id: string;
	provider?: VideoProvider;
	src: StaticImageData | string;
	startTime?: number;
	title: string;
}

export function VideoCard(props: Readonly<VideoCardProps>): ReactNode {
	const { description, id, provider = "youtube", src, startTime, title } = props;

	const url = createVideoUrl(provider, id, startTime);

	return (
		<LightBoxOverlay>
			<figure className="relative flex size-full flex-col items-center gap-y-4 rounded-xl border border-neutral-200 bg-white p-6 text-neutral-800 shadow-md transition focus-within:ring focus-within:ring-brand-700 hover:shadow-lg">
				<div className="not-prose relative aspect-video size-full overflow-hidden rounded-lg border border-neutral-200">
					<Image
						alt=""
						className="absolute inset-0 size-full object-cover"
						sizes="(max-width: 839px) 723px, 320px"
						src={src}
					/>
				</div>
				<figcaption>
					<LightboxTrigger className="grid justify-center justify-items-center gap-y-1 after:absolute after:inset-0 focus:outline-none">
						<PlayCircleIcon
							aria-hidden={true}
							className="mx-auto size-12 shrink-0 text-brand-700"
						/>
						<strong className="text-xl font-bold">{title}</strong>
						<div className="text-neutral-500">{description}</div>
					</LightboxTrigger>
				</figcaption>
			</figure>

			<LightBox>
				<iframe
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen={true}
					className="absolute inset-0 size-full object-cover"
					loading="lazy"
					src={String(url)}
					title={title}
				/>
			</LightBox>
		</LightBoxOverlay>
	);
}
