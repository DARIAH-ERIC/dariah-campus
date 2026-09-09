import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { ImagesIcon } from "lucide-react";

import { ImageComparisonSliderPreview } from "#/lib/content/keystatic/components/image-comparison-slider/preview.tsx";

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
				leftAlt: fields.text({
					label: "Left image description for assistive technology",
					description:
						"Leave empty if the image is only decorative or already explained in the text. Both descriptions are read out one after the other, so describe what differs instead of repeating shared context.",
					validation: { isRequired: false },
				}),
				right: fields.image({
					label: "Right image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				rightAlt: fields.text({
					label: "Right image description for assistive technology",
					description:
						"Leave empty if the image is only decorative or already explained in the text. Both descriptions are read out one after the other, so describe what differs instead of repeating shared context.",
					validation: { isRequired: false },
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
						leftAlt={value.leftAlt}
						orientation={value.orientation}
						right={value.right}
						rightAlt={value.rightAlt}
					>
						{children}
					</ImageComparisonSliderPreview>
				);
			},
		}),
	};
});
