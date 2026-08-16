import { createCollection } from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

export const createDariahWorkingGroups = createCollection(
	"/dariah-working-groups/",
	(paths, locale) => {
		return collection({
			label: "DARIAH working groups",
			path: `./content/${locale}/dariah-working-groups/*`,
			format: { data: "json" },
			slugField: "slug",
			columns: ["name"],
			entryLayout: "form",
			schema: {
				slug: fields.slug({
					name: {
						label: "Working group slug",
						validation: { isRequired: true },
					},
				}),
				name: fields.text({
					label: "Name",
					validation: { isRequired: true },
				}),
				"sshoc-marketplace-id": fields.text({
					label: "SSHOC marketplace identifier",
					validation: { isRequired: true },
				}),
			},
		});
	},
);
