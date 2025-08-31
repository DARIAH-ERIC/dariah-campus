/* eslint-disable react-x/prefer-read-only-props */

import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { ImageIcon } from "lucide-react";

import { FigurePreview } from "@/lib/content/keystatic/components/figure/preview";
import { figureAlignments } from "@/lib/content/options";

export const createFigure = createComponent((paths, _locale) => {
	return {
		Figure: wrapper({
			label: "Figure",
			description: "Insert an image with caption.",
			icon: <ImageIcon />,
			schema: {
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				alt: fields.text({
					label: "Image description for assistive technology",
					description:
						"Leave empty if the image is only decorative or already explained in the text",
					validation: { isRequired: false },
				}),
				alignment: fields.select({
					label: "Alignment",
					options: figureAlignments,
					defaultValue: "stretch",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<FigurePreview alignment={value.alignment} alt={value.alt} src={value.src}>
						{children}
					</FigurePreview>
				);
			},
		}),
	};
});
