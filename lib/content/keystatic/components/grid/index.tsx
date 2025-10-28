/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { repeating, wrapper } from "@keystatic/core/content-components";
import { GridIcon, SquareIcon } from "lucide-react";

import { GridItemPreview, GridPreview } from "@/lib/content/keystatic/components/grid/preview";
import { gridAlignments, gridLayouts } from "@/lib/content/options";

export const createGrid = createComponent((_paths, _locale) => {
	return {
		Grid: repeating({
			label: "Grid",
			description: "Insert a layout grid.",
			icon: <GridIcon />,
			schema: {
				layout: fields.select({
					label: "Layout",
					options: gridLayouts,
					defaultValue: "two-columns",
				}),
				alignment: fields.select({
					label: "Vertical alignment",
					options: gridAlignments,
					defaultValue: "stretch",
				}),
			},
			children: ["GridItem"],
			ContentView(props) {
				const { children, value } = props;

				return (
					<GridPreview alignment={value.alignment} layout={value.layout}>
						{children}
					</GridPreview>
				);
			},
		}),
		GridItem: wrapper({
			label: "Grid item",
			description: "Insert a layout grid cell.",
			icon: <SquareIcon />,
			schema: {
				alignment: fields.select({
					label: "Vertical alignment",
					options: gridAlignments,
					defaultValue: "stretch",
				}),
			},
			forSpecificLocations: true,
			ContentView(props) {
				const { children, value } = props;

				return <GridItemPreview alignment={value.alignment}>{children}</GridItemPreview>;
			},
		}),
	};
});
