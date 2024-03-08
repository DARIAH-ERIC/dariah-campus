import { type CmsCollection } from "decap-cms-core";

import * as validation from "@/cms/utils/validation";

/**
 * Organisations collection.
 */
export const collection: CmsCollection = {
	name: "organisations",
	label: "Organisations",
	label_singular: "Organisation",
	description: "",
	folder: "content/organisations",
	identifier_field: "name",
	format: "yml",
	hide: true,
	create: true,
	delete: false,
	slug: "{{slug}}",
	media_folder: "images",
	public_folder: "images",
	preview_path: "organisation/{{slug}}",
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
			required: false,
			pattern: [validation.isUrl, "Must be a valid URL"],
		},
		{
			name: "logo",
			label: "Logo",
			hint: "",
			required: false,
			widget: "image",
		},
	],
};
