import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { block, repeating } from "@keystatic/core/content-components";
import { GrabIcon, SquareDashedIcon } from "lucide-react";

import {
	QuizDragAndDropPreview,
	QuizDropZonePreview,
} from "#/lib/content/keystatic/components/drag-and-drop/preview.tsx";

export const createQuizDragAndDrop = createComponent((paths, _locale) => {
	return {
		QuizDragAndDrop: repeating({
			label: "Quiz - Drag and drop",
			description: "Items which are dragged onto the drop zones they belong to.",
			icon: <GrabIcon />,
			forSpecificLocations: true,
			children: ["QuizDropZone"],
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
					<QuizDragAndDropPreview alt={value.alt} src={value.src}>
						{children}
					</QuizDragAndDropPreview>
				);
			},
		}),
		QuizDropZone: block({
			label: "Drop zone",
			description: "A target, and the items which belong in it.",
			icon: <SquareDashedIcon />,
			forSpecificLocations: true,
			schema: {
				label: fields.text({
					label: "Drop zone label",
					description: "Identifies the drop zone to every user. Defaults to the zone's position.",
					validation: { isRequired: false },
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
				x: fields.number({
					label: "Horizontal position (%)",
					description: "Distance of the zone's left edge from the left edge of the background image.",
					defaultValue: 0,
					step: 0.1,
					validation: { isRequired: true, min: 0, max: 100 },
				}),
				y: fields.number({
					label: "Vertical position (%)",
					description: "Distance of the zone's top edge from the top edge of the background image.",
					defaultValue: 0,
					step: 0.1,
					validation: { isRequired: true, min: 0, max: 100 },
				}),
				width: fields.number({
					label: "Width (%)",
					description: "Share of the background image's width.",
					defaultValue: 25,
					step: 0.1,
					validation: { isRequired: true, min: 1, max: 100 },
				}),
				height: fields.number({
					label: "Height (%)",
					description:
						"Share of the background image's height. A zone grows beyond it when more items are dropped in than fit.",
					defaultValue: 20,
					step: 0.1,
					validation: { isRequired: true, min: 1, max: 100 },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return (
					<QuizDropZonePreview
						height={value.height}
						items={value.items}
						label={value.label}
						width={value.width}
						x={value.x}
						y={value.y}
					/>
				);
			},
		}),
	};
});
