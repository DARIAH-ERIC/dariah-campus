import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { repeating, wrapper } from "@keystatic/core/content-components";
import { GrabIcon, SquareDashedIcon } from "lucide-react";

import {
	QuizImageDropZoneEditor,
	QuizImageDropZonesPreview,
} from "#/lib/content/keystatic/components/image-drop-zones/preview.tsx";

export const createQuizImageDropZones = createComponent((paths, _locale) => {
	return {
		QuizImageDropZones: repeating({
			label: "Image drop zones",
			description: "Items which are dragged onto the drop zones they belong to.",
			icon: <GrabIcon />,
			forSpecificLocations: true,
			children: ["QuizImageDropZone"],
			validation: { children: { min: 1 } },
			schema: {
				src: fields.image({
					label: "Background image",
					description:
						"Optional. With an image the drop zones are placed on top of it, without one they are laid out in a grid - which suits matching, ordering and grouping exercises.",
					validation: { isRequired: false },
					...createAssetOptions(paths.assetPath),
				}),
				alt: fields.text({
					label: "Image description for assistive technology",
					description:
						"Describe the image and the spatial information the drop zones rely on; leave empty only if the image is decorative.",
					validation: { isRequired: false },
				}),
				distractors: fields.array(
					fields.text({
						label: "Item",
						validation: { length: { min: 1 } },
					}),
					{
						label: "Distractors",
						description:
							"Extra items added to the bank that belong in no drop zone. They make the exercise harder to solve by elimination, and leaving them in the bank is part of the correct answer. Optional.",
						itemLabel(props) {
							return props.value;
						},
					},
				),
				instantFeedback: fields.checkbox({
					label: "Instant feedback",
					description:
						"Show correct/incorrect feedback as soon as the user drops an item, without requiring the Check button.",
					defaultValue: false,
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<QuizImageDropZonesPreview alt={value.alt} src={value.src}>
						{children}
					</QuizImageDropZonesPreview>
				);
			},
		}),
		QuizImageDropZone: wrapper({
			label: "Drop zone",
			description: "A target, the items which belong in it, and what it means.",
			icon: <SquareDashedIcon />,
			forSpecificLocations: true,
			editChildrenIn: "modal",
			schema: {
				label: fields.text({
					label: "Drop zone label",
					description: "Identifies the drop zone to every user. Defaults to the zone's position.",
					validation: { isRequired: false },
				}),
				shape: fields.select({
					label: "Shape",
					description:
						"An ellipse is inscribed in the same box as a rectangle, and only accepts drops inside its outline. Because the position is measured in percentages of the image, equal width and height give a circle only on a square image.",
					options: [
						{ label: "Rectangle", value: "rectangle" },
						{ label: "Ellipse", value: "ellipse" },
					],
					defaultValue: "rectangle",
				}),
				items: fields.array(
					fields.text({
						label: "Item",
						validation: { length: { min: 1 } },
					}),
					{
						label: "Correct items",
						description:
							"The items which belong in this drop zone. They join the shared item bank, so the exercise never gives away which zone an item was authored for. A zone without items accepts nothing, and works as a trap.",
						itemLabel(props) {
							return props.value;
						},
					},
				),
				/**
				 * Left empty the zone is not placed yet, and the editor asks for it to be drawn onto the image. Zones in an
				 * exercise without a background image stay empty for good, because there is nothing to position them against.
				 */
				x: fields.number({
					label: "Horizontal position (%)",
					description: "Distance of the zone's left edge from the left edge of the background image.",
					step: 0.1,
					validation: { isRequired: false, min: 0, max: 100 },
				}),
				y: fields.number({
					label: "Vertical position (%)",
					description: "Distance of the zone's top edge from the top edge of the background image.",
					step: 0.1,
					validation: { isRequired: false, min: 0, max: 100 },
				}),
				width: fields.number({
					label: "Width (%)",
					description: "Share of the background image's width.",
					step: 0.1,
					validation: { isRequired: false, min: 1, max: 100 },
				}),
				height: fields.number({
					label: "Height (%)",
					description:
						"Share of the background image's height. A rectangle grows beyond it when more items are dropped in than fit.",
					step: 0.1,
					validation: { isRequired: false, min: 1, max: 100 },
				}),
			},
			NodeView(props) {
				return <QuizImageDropZoneEditor {...props} />;
			},
		}),
	};
});
