import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { SeparatorHorizontalIcon } from "lucide-react";

import { SplitPointPreview } from "#/lib/content/keystatic/components/split-point/preview.tsx";
import * as validation from "#/lib/content/keystatic/validation.ts";

export const createSplitPoint = createComponent((_paths, _locale) => {
	return {
		SplitPoint: block({
			label: "Split point",
			description: "Start a new section.",
			icon: <SeparatorHorizontalIcon />,
			schema: {
				id: fields.text({
					label: "ID",
					description:
						'Identifies the section in the page url, e.g. "?section=getting-started". Generated when left empty, but then changes whenever a section is inserted before it.',
					validation: { isRequired: false, pattern: validation.urlSlugOptional },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <SplitPointPreview id={value.id} />;
			},
		}),
	};
});
