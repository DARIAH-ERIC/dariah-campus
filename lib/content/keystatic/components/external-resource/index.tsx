/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { BookIcon } from "lucide-react";

import { ExternalResourcePreview } from "@/lib/content/keystatic/components/external-resource/preview";

export const createExternalResource = createComponent((_paths, _locale) => {
	return {
		ExternalResource: block({
			label: "External resource",
			description: "Insert an link to an external resource.",
			icon: <BookIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
				subtitle: fields.text({
					label: "Subtitle",
					validation: { isRequired: true },
				}),
				url: fields.url({
					label: "URL",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <ExternalResourcePreview subtitle={value.subtitle} title={value.title} />;
			},
		}),
	};
});
