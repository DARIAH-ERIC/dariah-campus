/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { AppWindowIcon } from "lucide-react";

import { EmbedPreview } from "@/lib/content/keystatic/components/embed/preview";

export const createEmbed = createComponent((_paths, _locale) => {
	return {
		Embed: wrapper({
			label: "Embed",
			description: "Insert content from another website.",
			icon: <AppWindowIcon />,
			schema: {
				src: fields.url({
					label: "URL",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return <EmbedPreview src={value.src}>{children}</EmbedPreview>;
			},
		}),
	};
});
