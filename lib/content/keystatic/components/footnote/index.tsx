import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { mark } from "@keystatic/core/content-components";
import { SuperscriptIcon } from "lucide-react";

export const createFootnote = createComponent((_paths, _locale) => {
	return {
		Footnote: mark({
			label: "Footnote",
			icon: <SuperscriptIcon />,
			schema: {},
			className: "underline decoration-dotted align-super text-sm",
		}),
	};
});
