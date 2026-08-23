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
			description: "Split the content into sections, which are displayed one at a time.",
			icon: <SeparatorHorizontalIcon />,
			schema: {
				id: fields.text({
					label: "ID",
					description:
						'Identifies the section which follows this split point, and is used in the page url, e.g. "?section=getting-started".',
					validation: { isRequired: true, pattern: validation.urlSlug },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <SplitPointPreview id={value.id} />;
			},
		}),
	};
});
