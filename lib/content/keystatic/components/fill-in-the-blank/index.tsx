/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { FormInputIcon } from "lucide-react";

import { FillInTheBlankPreview } from "@/lib/content/keystatic/components/fill-in-the-blank/preview";

export const createFillInTheBlank = createComponent((_paths, _locale) => {
	return {
		FillInTheBlank: wrapper({
			label: "Fill in the blank",
			description: "An interactive fill-in-the-blank exercise.",
			icon: <FormInputIcon />,
			schema: {
				caseSensitive: fields.checkbox({
					label: "Case sensitive",
					defaultValue: false,
				}),
				validateOnBlur: fields.checkbox({
					label: "Validate on blur",
					description:
						"Show correct/incorrect feedback when the user leaves a blank, without requiring the Check button.",
					defaultValue: false,
				}),
			},
			ContentView(props) {
				const { children } = props;

				return <FillInTheBlankPreview>{children}</FillInTheBlankPreview>;
			},
		}),
	};
});
