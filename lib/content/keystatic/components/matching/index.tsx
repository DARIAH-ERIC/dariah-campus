import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { repeating, wrapper } from "@keystatic/core/content-components";
import { LayoutGridIcon, SquareDashedIcon } from "lucide-react";

import { QuizMatchingPreview, QuizMatchingZoneEditor } from "#/lib/content/keystatic/components/matching/preview.tsx";

export const createQuizMatching = createComponent((_paths, _locale) => {
	return {
		QuizMatching: repeating({
			label: "Matching",
			description: "Items which are dragged into the zones they belong to - and, optionally, zones put in order.",
			icon: <LayoutGridIcon />,
			forSpecificLocations: true,
			children: ["QuizQuestion", "QuizMatchingZone"],
			validation: { children: { min: 1 } },
			schema: {
				orderedZones: fields.checkbox({
					label: "Ordered zones",
					description:
						"Present the zones out of order, and make putting them back into the order they are listed in here part of the correct answer. For an exercise which tests both what belongs together and what comes first.",
					defaultValue: false,
				}),
				distractors: fields.array(
					fields.object(
						{
							label: fields.text({
								label: "Item",
								validation: { length: { min: 1 } },
							}),
						},
						{
							label: "Distractor",
						},
					),
					{
						label: "Distractors",
						description:
							"Extra items added to the bank that belong in no zone. They make the exercise harder to solve by elimination, and leaving them in the bank is part of the correct answer. Optional.",
						itemLabel(props) {
							return props.fields.label.value;
						},
					},
				),
				instantFeedback: fields.checkbox({
					label: "Instant feedback",
					description:
						"Show correct/incorrect feedback as soon as the user drops an item or moves a zone, without requiring the Check button.",
					defaultValue: false,
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return <QuizMatchingPreview orderedZones={value.orderedZones}>{children}</QuizMatchingPreview>;
			},
		}),
		QuizMatchingZone: wrapper({
			label: "Zone",
			description: "A target, the items which belong in it, and what it means.",
			icon: <SquareDashedIcon />,
			forSpecificLocations: true,
			editChildrenIn: "modal",
			contentLabel: "What this zone means, revealed once the exercise has been answered",
			schema: {
				label: fields.text({
					label: "Zone label",
					description: "Identifies the zone to every user. Defaults to the zone's position.",
					validation: { isRequired: false },
				}),
				items: fields.array(
					fields.object(
						{
							label: fields.text({
								label: "Item",
								validation: { length: { min: 1 } },
							}),
						},
						{
							label: "Item",
						},
					),
					{
						label: "Correct items",
						description:
							"The items which belong in this zone. They join the shared item bank, so the exercise never gives away which zone an item was authored for. A zone without items accepts nothing, and works as a trap.",
						itemLabel(props) {
							return props.fields.label.value;
						},
					},
				),
			},
			NodeView(props) {
				return <QuizMatchingZoneEditor {...props} />;
			},
		}),
	};
});
