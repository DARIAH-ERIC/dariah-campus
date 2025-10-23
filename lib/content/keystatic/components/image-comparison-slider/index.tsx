/* eslint-disable react-x/prefer-read-only-props */

import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { ImagesIcon } from "lucide-react";

import { ImageComparisonSliderPreview } from "@/lib/content/keystatic/components/image-comparison-slider/preview";

export const createImageComparisonSlider = createComponent((paths, _locale) => {
	return {
		ImageComparisonSlider: wrapper({
			label: "Image comparison slider",
			description: "Insert a slider to compare two images.",
			icon: <ImagesIcon />,
			schema: {
				left: fields.image({
					label: "Left image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				right: fields.image({
					label: "Right image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				orientation: fields.select({
					label: "Orientation",
					options: [
						{ value: "horizontal", label: "Horizontal" },
						{ value: "vertical", label: "Vertical" },
					],
					defaultValue: "horizontal",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<ImageComparisonSliderPreview
						left={value.left}
						orientation={value.orientation}
						right={value.right}
					>
						{children}
					</ImageComparisonSliderPreview>
				);
			},
		}),
	};
});
