import { type CmsCollection } from "decap-cms-core";

import * as validation from "@/cms/utils/validation";

/**
 * Licences collection.
 */
export const collection: CmsCollection = {
	name: "licences",
	label: "Licences",
	label_singular: "Licence",
	description: "",
	folder: "content/licences",
	identifier_field: "name",
	format: "yml",
	hide: true,
	create: true,
	delete: false,
	slug: "{{slug}}",
	media_folder: "../../{{media_folder}}/licences",
	public_folder: "{{public_folder}}/licences",
	preview_path: "licence/{{slug}}",
	sortable_fields: ["commit_date", "name"],
	fields: [
		{
			name: "name",
			label: "Name",
			hint: "",
		},
		{
			name: "url",
			label: "URL",
			hint: "",
			pattern: [validation.isUrl, "Must be a valid URL"],
		},
	],
};
