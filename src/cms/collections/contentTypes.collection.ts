import { type CmsCollection } from "decap-cms-core";

/**
 * ContentTypes collection.
 */
export const collection: CmsCollection = {
	name: "contentTypes",
	label: "ContentTypes",
	label_singular: "ContentType",
	description: "",
	folder: "content/contentTypes",
	identifier_field: "name",
	format: "yml",
	hide: true,
	create: true,
	delete: false,
	slug: "{{slug}}",
	media_folder: "../../{{media_folder}}/contentTypes",
	public_folder: "{{public_folder}}/contentTypes",
	preview_path: "contentType/{{slug}}",
	sortable_fields: ["commit_date", "name"],
	fields: [
		{
			name: "name",
			label: "Name",
			hint: "",
		},
	],
};
