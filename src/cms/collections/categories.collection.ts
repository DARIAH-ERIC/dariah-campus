import { type CmsCollection } from "netlify-cms-core";

/**
 * Categories collection.
 */
export const collection: CmsCollection = {
	name: "categories",
	label: "Sources",
	label_singular: "Source",
	description: "",
	folder: "content/categories",
	identifier_field: "name",
	format: "yml",
	hide: true,
	create: true,
	delete: false,
	slug: "{{slug}}",
	media_folder: "images",
	public_folder: "images",
	preview_path: "source/{{slug}}",
	sortable_fields: ["commit_date", "name"],
	fields: [
		{
			name: "name",
			label: "Name",
			hint: "",
		},
		{
			name: "description",
			label: "Description",
			hint: "",
			widget: "text",
		},
		{
			name: "image",
			label: "Image",
			hint: "",
			required: false,
			widget: "image",
		},
		{
			name: "host",
			label: "Host",
			hint: "",
			required: false,
		},
	],
};
