/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { FormInputIcon } from "lucide-react";

import { DragTheWordsPreview } from "@/lib/content/keystatic/components/drag-the-words/preview";

export const createDragTheWords = createComponent((_paths, _locale) => {
	return {
		DragTheWords: wrapper({
			label: "Quiz - Drag the words",
			description: "An interactive drag-the-words exercise.",
			icon: <FormInputIcon />,
			forSpecificLocations: true,
			schema: {
				caseSensitive: fields.checkbox({
					label: "Case sensitive",
					defaultValue: false,
				}),
				distractors: fields.array(
					fields.text({
						label: "Word",
						validation: { length: { min: 1 } },
					}),
					{
						label: "Distractors",
						description:
							"Extra words added to the bank that belong in no blank. They make the exercise harder to solve by elimination. Optional.",
						itemLabel(props) {
							return props.value;
						},
					},
				),
				instantFeedback: fields.checkbox({
					label: "Instant feedback",
					description:
						"Show correct/incorrect feedback as soon as the user places a word, without requiring the Check button.",
					defaultValue: false,
				}),
			},
			ContentView(props) {
				const { children } = props;

				return <DragTheWordsPreview>{children}</DragTheWordsPreview>;
			},
		}),
	};
});
