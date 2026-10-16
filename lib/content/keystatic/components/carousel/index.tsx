import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { repeating, wrapper } from "@keystatic/core/content-components";
import { GalleryHorizontalIcon, ImageIcon } from "lucide-react";

import { CarouselItemPreview, CarouselPreview } from "#/lib/content/keystatic/components/carousel/preview.tsx";

export const createCarousel = createComponent((paths, _locale) => {
	return {
		Carousel: repeating({
			label: "Carousel",
			description: "Insert a carousel.",
			icon: <GalleryHorizontalIcon />,
			schema: {
				label: fields.text({
					label: "Label",
					description: 'Accessible name, announced by screen readers. Should not include the word "carousel".',
				}),
				loop: fields.checkbox({
					label: "Loop",
					description: "Continue from the last slide back to the first slide.",
					defaultValue: false,
				}),
			},
			children: ["CarouselItem"],
			validation: { children: { min: 1 } },
			ContentView(props) {
				const { children } = props;

				return <CarouselPreview>{children}</CarouselPreview>;
			},
		}),
		CarouselItem: wrapper({
			label: "Carousel slide",
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
					description: "Leave empty if the image is only decorative or already explained in the text",
					validation: { isRequired: false },
				}),
			},
			forSpecificLocations: true,
			ContentView(props) {
				const { children, value } = props;

				return (
					<CarouselItemPreview alt={value.alt} src={value.src}>
						{children}
					</CarouselItemPreview>
				);
			},
		}),
	};
});
