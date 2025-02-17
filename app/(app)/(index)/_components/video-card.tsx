import { PlayCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Video } from "@/app/(app)/(index)/_components/video";
import { LightBox, LightBoxOverlay, LightboxTrigger } from "@/components/content/lightbox";
import { ServerImage as Image } from "@/components/server-image";

interface VideoCardProps {
	description: string;
	id: string;
	image: string;
	title: string;
}

export function VideoCard(props: VideoCardProps): ReactNode {
	const { description, id, image, title } = props;

	return (
		<LightBoxOverlay>
			<figure className="relative flex size-full flex-col items-center space-y-4 rounded-xl bg-white p-6 text-neutral-800 shadow-md transition focus-within:ring focus-within:ring-primary-600 hover:shadow-lg">
				<div className="not-prose relative aspect-video size-full overflow-hidden rounded-lg border border-neutral-200">
					<Image
						alt=""
						className="absolute inset-0 size-full object-cover"
						sizes="(max-width: 640px) 544px, (max-width: 814px) 718px, 256px"
						src={image}
					/>
				</div>
				<figcaption>
					<LightboxTrigger className="grid justify-center justify-items-center gap-y-1 after:absolute after:inset-0 focus:outline-none">
						<PlayCircleIcon
							aria-hidden={true}
							className="mx-auto size-12 shrink-0 text-primary-600"
						/>
						<strong className="text-xl font-bold">{title}</strong>
						<div className="text-neutral-500">{description}</div>
					</LightboxTrigger>
				</figcaption>
			</figure>

			<LightBox>
				<Video caption={[title, description].join(" - ")} id={id} />
			</LightBox>
		</LightBoxOverlay>
	);
}
