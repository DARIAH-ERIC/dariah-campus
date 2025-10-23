import { createCollection } from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

export const createDariahNationalConsortia = createCollection(
	"/dariah-national-consortia/",
	(paths, locale) => {
		return collection({
			label: "DARIAH national consortia",
			path: `./content/${locale}/dariah-national-consortia/*`,
			format: { data: "json" },
			slugField: "code",
			columns: ["name"],
			entryLayout: "form",
			schema: {
				code: fields.slug({
					name: {
						label: "Country code",
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
