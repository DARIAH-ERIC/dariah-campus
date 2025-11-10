/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { repeating, wrapper } from "@keystatic/core/content-components";
import { ChartBarStackedIcon, TextIcon } from "lucide-react";

import {
	DiagramCaptionPreview,
	DiagramCodeBlockPreview,
	DiagramPreview,
} from "@/lib/content/keystatic/components/diagram/preview";

export const createDiagram = createComponent((_paths, _locale) => {
	return {
		Diagram: repeating({
			label: "Diagram",
			description: "Insert a diagram with caption.",
			icon: <ChartBarStackedIcon />,
			schema: {},
			children: ["DiagramCaption", "DiagramCodeBlock"],
			validation: { children: { min: 1, max: 2 } },
			ContentView(props) {
				const { children } = props;

				return <DiagramPreview>{children}</DiagramPreview>;
			},
		}),
		DiagramCaption: wrapper({
			label: "Caption",
			description: "Insert a diagram caption.",
			icon: <TextIcon />,
			schema: {},
			forSpecificLocations: true,
			ContentView(props) {
				const { children } = props;

				return <DiagramCaptionPreview>{children}</DiagramCaptionPreview>;
			},
		}),
		DiagramCodeBlock: wrapper({
			label: "Code block",
			description: "Insert a diagram definition.",
			icon: <ChartBarStackedIcon />,
			schema: {},
			forSpecificLocations: true,
			ContentView(props) {
				const { children } = props;

				return <DiagramCodeBlockPreview>{children}</DiagramCodeBlockPreview>;
			},
		}),
	};
});
