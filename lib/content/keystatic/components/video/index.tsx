/* eslint-disable react-x/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { VideoIcon } from "lucide-react";

import { VideoPreview } from "@/lib/content/keystatic/components/video/preview";
import * as validation from "@/lib/content/keystatic/validation";
import { videoProviders } from "@/lib/content/options";

export const createVideo = createComponent((_paths, _locale) => {
	return {
		Video: wrapper({
			label: "Video",
			description: "Insert a video.",
			icon: <VideoIcon />,
			schema: {
				provider: fields.select({
					label: "Provider",
					options: videoProviders,
					defaultValue: "youtube",
				}),
				id: fields.text({
					label: "Video ID",
					validation: { pattern: validation.videoId },
				}),
				startTime: fields.number({
					label: "Start time",
					validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<VideoPreview id={value.id} provider={value.provider} startTime={value.startTime}>
						{children}
					</VideoPreview>
				);
			},
		}),
	};
});
