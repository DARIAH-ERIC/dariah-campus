/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { wrapper } from "@keystatic/core/content-components";
import { LinkIcon } from "lucide-react";

import { LinkButtonPreview } from "@/lib/content/keystatic/components/link-button/preview";
import { createLinkSchema } from "@/lib/content/keystatic/utils/create-link-schema";

export const createLinkButton = createComponent((paths, locale) => {
	return {
		LinkButton: wrapper({
			label: "LinkButton",
			description: "Insert a link, which looks like a button.",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(paths.downloadPath, locale),
			},
			ContentView(props) {
				const { children, value } = props;

				return <LinkButtonPreview link={value.link}>{children}</LinkButtonPreview>;
			},
		}),
	};
});
