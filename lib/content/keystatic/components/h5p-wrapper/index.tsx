import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { readonly } from "@acdh-oeaw/keystatic-lib/fields/readonly";
import { block } from "@keystatic/core/content-components";
import { HashIcon } from "lucide-react";

import { H5PWrapperPreview } from "@/lib/content/keystatic/components/h5p-wrapper/preview";

export const createH5PWrapper = createComponent((_paths, _locale) => {
	return {
		H5PWrapper: block({
			label: "H5PWrapper",
			description: "Will be replaced by a widget",
			icon: <HashIcon />,
			schema: {
				path: readonly({
					label: "H5p conent path (readonly)",
					description: "path to h5p files",
				}),
			},
			ContentView() {
				return <H5PWrapperPreview>{"H5PContent"}</H5PWrapperPreview>;
			},
		}),
	};
});
