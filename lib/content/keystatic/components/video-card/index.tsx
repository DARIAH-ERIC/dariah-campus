/* eslint-disable react-x/prefer-read-only-props */

import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { VideoIcon } from "lucide-react";

import { VideoCardPreview } from "@/lib/content/keystatic/components/video-card/preview";
import { videoProviders } from "@/lib/content/options";

export const createVideoCard = createComponent((paths, _locale) => {
	return {
		VideoCard: block({
			label: "Video card",
			description: "Insert an video card.",
			icon: <VideoIcon />,
			schema: {
				provider: fields.select({
					label: "Provider",
					options: videoProviders,
					defaultValue: "youtube",
				}),
				id: fields.text({
					label: "Video ID",
					validation: { isRequired: true },
				}),
				startTime: fields.number({
					label: "Start time",
					validation: { isRequired: false },
				}),
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
				subtitle: fields.text({
					label: "Subtitle",
					validation: { isRequired: false },
				}),
				image: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
			},
			ContentView(props) {
				const { value } = props;

				return (
					<VideoCardPreview
						id={value.id}
						image={value.image}
						provider={value.provider}
						startTime={value.startTime}
						subtitle={value.subtitle}
						title={value.title}
					/>
				);
			},
		}),
	};
});
