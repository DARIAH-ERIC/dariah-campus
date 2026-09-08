import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { block, repeating } from "@keystatic/core/content-components";
import { ImageIcon, LayersIcon } from "lucide-react";

import { ImageLayerPreview, ImageLayersPreview } from "#/lib/content/keystatic/components/image-layers/preview.tsx";

export const createImageLayers = createComponent((paths, _locale) => {
	return {
		ImageLayers: repeating({
			label: "Image layers",
			description: "Insert stacked images revealed with a slider.",
			icon: <LayersIcon />,
			schema: {
				label: fields.text({
					label: "Label",
					description: "Accessible name for the slider, displayed above it.",
				}),
			},
			children: ["ImageLayer"],
			validation: { children: { min: 2 } },
			ContentView(props) {
				const { children } = props;

				return <ImageLayersPreview>{children}</ImageLayersPreview>;
			},
		}),
		ImageLayer: block({
			label: "Image layer",
			description: "Insert an image layer. The first layer serves as base image.",
			icon: <ImageIcon />,
			schema: {
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				label: fields.text({
					label: "Layer name",
					description: "Identifies the layer when it is selected with the slider. Defaults to the layer's position.",
					validation: { isRequired: false },
				}),
				alt: fields.text({
					label: "Image description for assistive technology",
					description:
						"Leave empty if the layer is only decorative or already explained in the text. Usually only the base image needs a description.",
					validation: { isRequired: false },
				}),
			},
			forSpecificLocations: true,
			ContentView(props) {
				const { value } = props;

				return <ImageLayerPreview alt={value.alt} label={value.label} src={value.src} />;
			},
		}),
	};
});
