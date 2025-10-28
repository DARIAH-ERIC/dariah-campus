/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { ListIcon } from "lucide-react";

import { TableOfContentsPreview } from "@/lib/content/keystatic/components/table-of-contents/preview";

export const createTableOfContents = createComponent((_paths, _locale) => {
	return {
		TableOfContents: block({
			label: "Table of contents",
			description: "Insert a table of contents.",
			icon: <ListIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <TableOfContentsPreview title={value.title} />;
			},
		}),
	};
});
