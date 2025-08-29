/* eslint-disable react-x/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { inline } from "@keystatic/core/content-components";
import { HashIcon } from "lucide-react";

import { HeadingIdPreview } from "@/lib/content/keystatic/components/heading-id/preview";

export const createHeadingId = createComponent((_paths, _locale) => {
	return {
		HeadingId: inline({
			label: "Heading identifier",
			description: "Add a custom link target to a heading.",
			icon: <HashIcon />,
			schema: {
				id: fields.text({
					label: "ID",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <HeadingIdPreview>{value.id}</HeadingIdPreview>;
			},
		}),
	};
});
