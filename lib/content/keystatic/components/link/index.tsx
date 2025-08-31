import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { mark } from "@keystatic/core/content-components";
import { LinkIcon } from "lucide-react";

import { createLinkSchema } from "@/lib/content/keystatic/utils/create-link-schema";

export const createLink = createComponent((paths, locale) => {
	return {
		Link: mark({
			label: "Link",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(paths.downloadPath, locale),
			},
			tag: "a",
		}),
	};
});
