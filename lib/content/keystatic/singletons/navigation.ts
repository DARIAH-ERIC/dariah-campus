import { createSingleton, withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { fields, singleton } from "@keystatic/core";

import { createLinkSchema } from "@/lib/content/keystatic/utils/create-link-schema";

export const createNavigation = createSingleton("/navigation/", (paths, locale) => {
	const link = createLinkSchema(paths.downloadPath, locale);

	return singleton({
		label: "Navigation",
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			links: fields.blocks(
				{
					link: {
						label: "Link",
						itemLabel(props) {
							return `${props.fields.label.value} (Link, ${props.fields.link.discriminant})`;
						},
						schema: fields.object(
							{
								label: fields.text({
									label: "Label",
									validation: { isRequired: true },
								}),
								link,
							},
							{
								label: "Link",
							},
						),
					},
					separator: {
						label: "Separator",
						itemLabel() {
							return "Separator";
						},
						schema: fields.empty(),
					},
					// menu: {
					// 	label: "Menu",
					// 	itemLabel(props) {
					// 		return `${props.fields.label.value} (Menu)`;
					// 	},
					// 	schema: fields.object(
					// 		{
					// 			label: fields.text({
					// 				label: "Label",
					// 				validation: { isRequired: true },
					// 			}),
					// 			items: fields.blocks(
					// 				{
					// 					link: {
					// 						label: "Link",
					// 						itemLabel(props) {
					// 							return `${props.fields.label.value} (Link, ${props.fields.link.discriminant})`;
					// 						},
					// 						schema: fields.object(
					// 							{
					// 								label: fields.text({
					// 									label: "Label",
					// 									validation: { isRequired: true },
					// 								}),
					// 								link,
					// 							},
					// 							{
					// 								label: "Link",
					// 							},
					// 						),
					// 					},
					// 					separator: {
					// 						label: "Separator",
					// 						itemLabel() {
					// 							return "Separator";
					// 						},
					// 						schema: fields.empty(),
					// 					},
					// 				},
					// 				{
					// 					label: "Items",
					// 					validation: { length: { min: 1 } },
					// 				},
					// 			),
					// 		},
					// 		{
					// 			label: "Menu",
					// 		},
					// 	),
					// },
				},
				{
					label: "Links",
					validation: { length: { min: 1 } },
				},
			),
			documentation: fields.object(
				{
					links: fields.multiRelationship({
						label: "Page",
						collection: withI18nPrefix("documentation", locale),
						validation: { length: { min: 1 } },
					}),
				},
				{
					label: "Documentation pages",
				},
			),
		},
	});
});
