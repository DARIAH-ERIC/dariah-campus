/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { repeating, wrapper } from "@keystatic/core/content-components";
import { CaptionsIcon } from "lucide-react";

import { TabPreview, TabsPreview } from "@/lib/content/keystatic/components/tabs/preview";

export const createTabs = createComponent((_paths, _locale) => {
	return {
		Tabs: repeating({
			label: "Tabs",
			description: "Insert tabs.",
			icon: <CaptionsIcon />,
			schema: {},
			children: ["Tab"],
			ContentView(props) {
				const { children } = props;

				return <TabsPreview>{children}</TabsPreview>;
			},
		}),
		Tab: wrapper({
			label: "Tab",
			description: "Insert a tab panel.",
			icon: <CaptionsIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
			},
			forSpecificLocations: true,
			ContentView(props) {
				const { children, value } = props;

				return <TabPreview title={value.title}>{children}</TabPreview>;
			},
		}),
	};
});
