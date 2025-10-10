/* eslint-disable react-x/prefer-read-only-props */

import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { ImagesIcon } from "lucide-react";

import { ImageSliderPreview } from "@/lib/content/keystatic/components/image-slider/preview";

export const createImageSlider = createComponent((paths, _locale) => {
	return {
		ImageSlider: wrapper({
			label: "Image slider",
			description: "Insert an image slider to compare two images.",
			icon: <ImagesIcon />,
			schema: {
				left: fields.image({
					label: "Left image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				right: fields.image({
					label: "Left image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<ImageSliderPreview left={value.left} right={value.right}>
						{children}
					</ImageSliderPreview>
				);
			},
		}),
	};
});
