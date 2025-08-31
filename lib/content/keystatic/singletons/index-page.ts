import { createAssetOptions, createSingleton, withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { fields, singleton } from "@keystatic/core";

import { createPreviewUrl } from "@/lib/content/keystatic/utils/create-preview-url";

export const createIndexPage = createSingleton("/index-page/", (paths, locale) => {
	return singleton({
		label: "Home page",
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		previewUrl: createPreviewUrl("/"),
		schema: {
			title: fields.text({
				label: "Title",
				validation: { isRequired: true },
			}),
			lead: fields.text({
				label: "Lead",
				validation: { isRequired: true },
				multiline: true,
			}),
			image: fields.image({
				label: "Image",
				validation: { isRequired: true },
				...createAssetOptions(paths.assetPath),
			}),
			"browse-section": fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					lead: fields.text({
						label: "Lead",
						validation: { isRequired: true },
						multiline: true,
					}),
					links: fields.array(
						fields.object(
							{
								title: fields.text({
									label: "Title",
									validation: { isRequired: true },
								}),
								description: fields.text({
									label: "Description",
									validation: { isRequired: true },
									multiline: true,
								}),
								href: fields.url({
									label: "URL",
									validation: { isRequired: true },
								}),
								image: fields.image({
									label: "Image",
									validation: { isRequired: true },
									...createAssetOptions(paths.assetPath),
								}),
							},
							{
								label: "Link",
							},
						),
						{
							label: "Links",
							validation: { length: { min: 1 } },
							itemLabel(props) {
								return props.fields.title.value;
							},
						},
					),
				},
				{
					label: "Browse section",
				},
			),
			"about-section": fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					lead: fields.text({
						label: "Lead",
						validation: { isRequired: true },
						multiline: true,
					}),
					videos: fields.array(
						fields.object(
							{
								id: fields.text({
									label: "YouTube ID",
									validation: { isRequired: true },
								}),
								title: fields.text({
									label: "Title",
									validation: { isRequired: true },
								}),
								description: fields.text({
									label: "Description",
									validation: { isRequired: true },
									multiline: true,
								}),
								src: fields.image({
									label: "Image",
									validation: { isRequired: true },
									...createAssetOptions(paths.assetPath),
								}),
							},
							{
								label: "Video",
							},
						),
						{
							label: "Videos",
							validation: { length: { min: 1 } },
							itemLabel(props) {
								return props.fields.title.value;
							},
						},
					),
				},
				{
					label: "About section",
				},
			),
			"faq-section": fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					lead: fields.text({
						label: "Lead",
						validation: { isRequired: true },
						multiline: true,
					}),
					faq: fields.array(
						fields.object(
							{
								title: fields.text({
									label: "Title",
									validation: { isRequired: true },
								}),
								content: fields.mdx.inline({
									label: "Content",
									options: {
										blockquote: false,
										codeBlock: false,
										heading: false,
										image: false,
										table: false,
									},
									components: {},
								}),
							},
							{
								label: "FAQ",
							},
						),
						{
							label: "FAQ",
							validation: { length: { min: 1 } },
							itemLabel(props) {
								return props.fields.title.value;
							},
						},
					),
				},
				{
					label: "FAQ section",
				},
			),
			"testimonial-section": fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					lead: fields.text({
						label: "Lead",
						validation: { isRequired: true },
						multiline: true,
					}),
					videos: fields.array(
						fields.object(
							{
								id: fields.text({
									label: "YouTube ID",
									validation: { isRequired: true },
								}),
								title: fields.text({
									label: "Title",
									validation: { isRequired: true },
								}),
								description: fields.text({
									label: "Description",
									validation: { isRequired: true },
									multiline: true,
								}),
								src: fields.image({
									label: "Image",
									validation: { isRequired: true },
									...createAssetOptions(paths.assetPath),
								}),
							},
							{
								label: "Video",
							},
						),
						{
							label: "Videos",
							validation: { length: { min: 1 } },
							itemLabel(props) {
								return props.fields.title.value;
							},
						},
					),
				},
				{
					label: "Testimonial section",
				},
			),
			"team-section": fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					lead: fields.text({
						label: "Lead",
						validation: { isRequired: true },
						multiline: true,
					}),
					team: fields.array(
						fields.object({
							person: fields.relationship({
								label: "Person",
								validation: { isRequired: true },
								collection: withI18nPrefix("people", locale),
							}),
							role: fields.text({
								label: "Description",
								validation: { isRequired: true },
							}),
						}),
						{
							label: "Team",
							validation: { length: { min: 1 } },
							itemLabel(props) {
								return props.fields.person.value ?? "Person";
							},
						},
					),
				},
				{
					label: "Team section",
				},
			),
		},
	});
});
