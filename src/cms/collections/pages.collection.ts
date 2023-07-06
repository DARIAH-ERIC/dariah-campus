import { type CmsCollection } from "netlify-cms-core";

/**
 * Pages collection.
 */
export const collection: CmsCollection = {
	name: "pages",
	label: "Pages",
	label_singular: "Page",
	description: "",
	format: "frontmatter",
	files: [
		{
			file: "content/pages/home/index.mdx",
			name: "home",
			label: "Home page",
			fields: [
				{
					name: "title",
					label: "Title",
					hint: "",
				},
				{
					name: "subtitle",
					label: "Subtitle",
					hint: "",
					required: false,
				},
				{
					name: "body",
					label: "Content",
					hint: "",
					widget: "markdown",
				},
			],
		},
		{
			file: "content/pages/imprint/index.mdx",
			name: "imprint",
			label: "Imprint page",
			fields: [
				{
					name: "title",
					label: "Title",
					hint: "",
				},
				{
					name: "subtitle",
					label: "Subtitle",
					hint: "",
					required: false,
				},
				{
					name: "body",
					label: "Content",
					hint: "",
					widget: "markdown",
				},
			],
		},
	],
};
