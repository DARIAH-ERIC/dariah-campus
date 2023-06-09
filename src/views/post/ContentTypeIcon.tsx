import { type FC, type SVGProps } from "react";

import AudioIcon from "@/assets/icons/campus/audio.svg?symbol";
import BookIcon from "@/assets/icons/campus/book.svg?symbol";
import EventIcon from "@/assets/icons/campus/event.svg?symbol";
import GlobeIcon from "@/assets/icons/campus/globe.svg?symbol";
import PathfinderIcon from "@/assets/icons/campus/pathfinder.svg?symbol";
import VideoIcon from "@/assets/icons/campus/video.svg?symbol";
import { type PostPreview } from "@/cms/api/posts.api";
import { Icon } from "@/common/Icon";

const contentTypeIcons: Record<
	PostPreview["type"]["id"],
	FC<SVGProps<SVGSVGElement> & { title?: string }>
> = {
	audio: AudioIcon,
	event: EventIcon,
	pathfinder: PathfinderIcon,
	slides: BookIcon,
	"training-module": BookIcon,
	video: VideoIcon,
	"webinar-recording": BookIcon,
	website: GlobeIcon,
};

export interface ContentTypeIconProps {
	className?: string;
	type: PostPreview["type"]["id"];
}

/**
 * Icon for resource content-type.
 */
export function ContentTypeIcon(props: ContentTypeIconProps): JSX.Element | null {
	const icon = contentTypeIcons[props.type];

	if (icon == null) return null;

	return <Icon icon={icon} className={props.className} />;
}
