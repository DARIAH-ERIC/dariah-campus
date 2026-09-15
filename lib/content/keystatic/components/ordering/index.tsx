import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { repeating, wrapper } from "@keystatic/core/content-components";
import { ListOrderedIcon, RectangleHorizontalIcon } from "lucide-react";

import { QuizOrderingItemEditor, QuizOrderingPreview } from "#/lib/content/keystatic/components/ordering/preview.tsx";

export const createQuizOrdering = createComponent((_paths, _locale) => {
	return {
		QuizOrdering: repeating({
			label: "Ordering",
			description: "Items which are arranged into the correct sequence. The authored order is the solution.",
			icon: <ListOrderedIcon />,
			forSpecificLocations: true,
			children: ["QuizQuestion", "QuizOrderingItem"],
			validation: { children: { min: 1 } },
			schema: {
				instantFeedback: fields.checkbox({
					label: "Instant feedback",
					description:
						"Mark every item as in or out of place as soon as the user makes their first move, without requiring the Check button.",
					defaultValue: false,
				}),
			},
			ContentView(props) {
				const { children } = props;

				return <QuizOrderingPreview>{children}</QuizOrderingPreview>;
			},
		}),
		QuizOrderingItem: wrapper({
			label: "Item",
			description: "A card in the sequence, and what it means.",
			icon: <RectangleHorizontalIcon />,
			forSpecificLocations: true,
			editChildrenIn: "modal",
			contentLabel: "What this item means, revealed once the exercise has been answered",
			schema: {
				label: fields.text({
					label: "Item",
					description: "The text on the card.",
					validation: { isRequired: true },
				}),
			},
			NodeView(props) {
				return <QuizOrderingItemEditor {...props} />;
			},
		}),
	};
});
