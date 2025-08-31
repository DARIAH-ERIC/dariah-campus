/* eslint-disable react-x/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { InfoIcon } from "lucide-react";

import { CalloutPreview } from "@/lib/content/keystatic/components/callout/preview";
import { calloutKinds } from "@/lib/content/options";

export const createCallout = createComponent((_paths, _locale) => {
	return {
		Callout: wrapper({
			label: "Callout",
			description: "Insert a note, tip, warning, or error.",
			icon: <InfoIcon />,
			schema: {
				kind: fields.select({
					label: "Kind",
					options: calloutKinds,
					defaultValue: "note",
				}),
				title: fields.text({
					label: "Title",
					validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<CalloutPreview kind={value.kind} title={value.title}>
						{children}
					</CalloutPreview>
				);
			},
		}),
	};
});
