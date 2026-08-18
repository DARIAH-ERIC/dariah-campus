import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { repeating, wrapper } from "@keystatic/core/content-components";
import { GalleryHorizontalIcon, SquareIcon } from "lucide-react";

import { CarouselItemPreview, CarouselPreview } from "#/lib/content/keystatic/components/carousel/preview.tsx";

export const createCarousel = createComponent((_paths, _locale) => {
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
			description: "Insert a carousel slide.",
			icon: <SquareIcon />,
			schema: {},
			forSpecificLocations: true,
			ContentView(props) {
				const { children } = props;

				return <CarouselItemPreview>{children}</CarouselItemPreview>;
			},
		}),
	};
});
