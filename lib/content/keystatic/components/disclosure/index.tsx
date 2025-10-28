/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { ChevronDownSquareIcon } from "lucide-react";

import { DisclosurePreview } from "@/lib/content/keystatic/components/disclosure/preview";

export const createDisclosure = createComponent((_paths, _locale) => {
	return {
		Disclosure: wrapper({
			label: "Disclosure",
			description: "Insert text hidden behind a toggle.",
			icon: <ChevronDownSquareIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return <DisclosurePreview title={value.title}>{children}</DisclosurePreview>;
			},
		}),
	};
});
