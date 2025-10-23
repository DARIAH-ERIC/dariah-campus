import {
	createAssetOptions,
	createCollection,
	createContentFieldOptions,
	withI18nPrefix,
} from "@acdh-oeaw/keystatic-lib";
import { readonly } from "@acdh-oeaw/keystatic-lib/fields/readonly";
import { collection, fields } from "@keystatic/core";

import { createCallout } from "@/lib/content/keystatic/components/callout";
// import { createDiagram } from "@/lib/content/keystatic/components/diagram";
import { createDisclosure } from "@/lib/content/keystatic/components/disclosure";
import { createEmbed } from "@/lib/content/keystatic/components/embed";
import { createFigure } from "@/lib/content/keystatic/components/figure";
import { createFootnote } from "@/lib/content/keystatic/components/footnote";
import { createGrid } from "@/lib/content/keystatic/components/grid";
import { createHeadingId } from "@/lib/content/keystatic/components/heading-id";
import { createLink } from "@/lib/content/keystatic/components/link";
import { createLinkButton } from "@/lib/content/keystatic/components/link-button";
import { createTabs } from "@/lib/content/keystatic/components/tabs";
import { createVideo } from "@/lib/content/keystatic/components/video";
import { createPreviewUrl } from "@/lib/content/keystatic/utils/create-preview-url";
import * as validation from "@/lib/content/keystatic/validation";
import { contentLanguages, contentLicenses, socialMediaKinds } from "@/lib/content/options";

export const createResourcesEvents = createCollection("/resources/events/", (paths, locale) => {
	return collection({
		label: "Events",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "form",
		previewUrl: createPreviewUrl("/resources/events/{slug}"),
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			locale: fields.select({
				label: "Language",
				options: contentLanguages,
				defaultValue: "en",
			}),
			"publication-date": fields.date({
				label: "Publication date",
				validation: { isRequired: true },
				defaultValue: { kind: "today" },
			}),
			"start-date": fields.date({
				label: "Start date",
				validation: { isRequired: true },
			}),
			"end-date": fields.date({
				label: "End date",
				validation: { isRequired: false },
			}),
			location: fields.text({
				label: "Location",
				validation: { isRequired: true },
			}),
			version: fields.text({
				label: "Version",
				defaultValue: "1.0.0",
			}),
			authors: fields.multiRelationship({
				label: "Authors",
				validation: { length: { min: 1 } },
				collection: withI18nPrefix("people", locale),
			}),
			organisations: fields.array(
				fields.object(
					{
						name: fields.text({
							label: "Name",
							validation: { isRequired: true },
						}),
						url: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						logo: fields.image({
							label: "Logo",
							validation: { isRequired: true },
							...createAssetOptions(paths.assetPath),
						}),
					},
					{
						label: "Organisation",
					},
				),
				{
					label: "Organisations",
					validation: { length: { min: 0 } },
					itemLabel(props) {
						return props.fields.name.value;
					},
				},
			),
			tags: fields.multiRelationship({
				label: "Tags",
				validation: { length: { min: 1 } },
				collection: withI18nPrefix("tags", locale),
			}),
			sources: fields.multiRelationship({
				label: "Sources",
				validation: { length: { min: 1 } },
				collection: withI18nPrefix("sources", locale),
			}),
			"featured-image": fields.image({
				label: "Featured image",
				validation: { isRequired: false },
				...createAssetOptions(paths.assetPath),
			}),
			license: fields.select({
				label: "License",
				options: contentLicenses,
				defaultValue: "cc-by-4.0",
			}),
			"table-of-contents": fields.checkbox({
				label: "Table of contents",
				defaultValue: true,
			}),
			attachments: fields.array(
				fields.object(
					{
						label: fields.text({
							label: "Label",
							validation: { isRequired: true },
						}),
						file: fields.file({
							label: "Attachment",
							validation: { isRequired: true },
							...createAssetOptions(paths.downloadPath),
						}),
					},
					{
						label: "Attachment",
					},
				),
				{
					label: "Attachments",
					validation: { length: { min: 0 } },
					itemLabel(props) {
						return props.fields.label.value;
					},
				},
			),
			links: fields.array(
				fields.object(
					{
						label: fields.text({
							label: "Label",
							validation: { isRequired: true },
						}),
						href: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
					},
					{
						label: "Link",
					},
				),
				{
					label: "Links",
					validation: { length: { min: 0 } },
					itemLabel(props) {
						return props.fields.label.value;
					},
				},
			),
			social: fields.array(
				fields.conditional(
					fields.select({
						label: "Kind",
						options: socialMediaKinds,
						defaultValue: "website",
					}),
					{
						bluesky: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						email: fields.text({
							label: "URL",
							validation: { isRequired: true, pattern: validation.email },
						}),
						facebook: fields.text({
							label: "URL",
							validation: { isRequired: true },
						}),
						flickr: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						github: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						instagram: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						linkedin: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						mastodon: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						orcid: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						rss: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						twitter: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						website: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						youtube: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
					},
				),
				{
					label: "Social media",
					validation: { length: { min: 0 } },
					itemLabel(props) {
						return props.discriminant;
					},
				},
			),
			summary: fields.object({
				title: fields.text({
					label: "Summary title",
					validation: { isRequired: false },
				}),
				content: fields.text({
					label: "Summary",
					validation: { isRequired: true },
					multiline: true,
				}),
			}),
			content: fields.mdx({
				label: "Content",
				options: {
					...createContentFieldOptions(paths),
					/**
					 * Prefer `<Link>` component over regular markdown links.
					 * Note that this also disables *parsing* regular markdown links.
					 */
					// link: false,
				},
				components: {
					...createCallout(paths, locale),
					// ...createDiagram(paths, locale),
					...createDisclosure(paths, locale),
					...createEmbed(paths, locale),
					...createFigure(paths, locale),
					...createFootnote(paths, locale),
					...createGrid(paths, locale),
					...createHeadingId(paths, locale),
					...createLink(paths, locale),
					...createLinkButton(paths, locale),
					...createTabs(paths, locale),
					...createVideo(paths, locale),
				},
			}),
			sessions: fields.array(
				fields.object(
					{
						title: fields.text({
							label: "Title",
							validation: { isRequired: true },
						}),
						speakers: fields.multiRelationship({
							label: "Speakers",
							validation: { length: { min: 0 } },
							collection: withI18nPrefix("people", locale),
						}),
						attachments: fields.array(
							fields.object(
								{
									label: fields.text({
										label: "Label",
										validation: { isRequired: true },
									}),
									file: fields.file({
										label: "Attachment",
										validation: { isRequired: true },
										...createAssetOptions(paths.downloadPath),
									}),
								},
								{
									label: "Attachment",
								},
							),
							{
								label: "Attachments",
								validation: { length: { min: 0 } },
								itemLabel(props) {
									return props.fields.label.value;
								},
							},
						),
						links: fields.array(
							fields.object(
								{
									label: fields.text({
										label: "Label",
										validation: { isRequired: true },
									}),
									href: fields.url({
										label: "URL",
										validation: { isRequired: true },
									}),
								},
								{
									label: "Link",
								},
							),
							{
								label: "Links",
								validation: { length: { min: 0 } },
								itemLabel(props) {
									return props.fields.label.value;
								},
							},
						),
						content: fields.mdx({
							label: "Content",
							options: {
								...createContentFieldOptions(paths),
								/**
								 * Prefer `<Link>` component over regular markdown links.
								 * Note that this also disables *parsing* regular markdown links.
								 */
								// link: false,
							},
							components: {
								...createCallout(paths, locale),
								// ...createDiagram(paths, locale),
								...createDisclosure(paths, locale),
								...createEmbed(paths, locale),
								...createFigure(paths, locale),
								...createFootnote(paths, locale),
								...createGrid(paths, locale),
								...createHeadingId(paths, locale),
								...createLink(paths, locale),
								...createLinkButton(paths, locale),
								...createTabs(paths, locale),
								...createVideo(paths, locale),
							},
						}),
						presentations: fields.array(
							fields.object(
								{
									title: fields.text({
										label: "Title",
										validation: { isRequired: true },
									}),
									speakers: fields.multiRelationship({
										label: "Speakers",
										validation: { length: { min: 0 } },
										collection: withI18nPrefix("people", locale),
									}),
									attachments: fields.array(
										fields.object(
											{
												label: fields.text({
													label: "Label",
													validation: { isRequired: true },
												}),
												file: fields.file({
													label: "Attachment",
													validation: { isRequired: true },
													...createAssetOptions(paths.downloadPath),
												}),
											},
											{
												label: "Attachment",
											},
										),
										{
											label: "Attachments",
											validation: { length: { min: 0 } },
											itemLabel(props) {
												return props.fields.label.value;
											},
										},
									),
									links: fields.array(
										fields.object(
											{
												label: fields.text({
													label: "Label",
													validation: { isRequired: true },
												}),
												href: fields.url({
													label: "URL",
													validation: { isRequired: true },
												}),
											},
											{
												label: "Link",
											},
										),
										{
											label: "Links",
											validation: { length: { min: 0 } },
											itemLabel(props) {
												return props.fields.label.value;
											},
										},
									),
									content: fields.mdx({
										label: "Content",
										options: {
											...createContentFieldOptions(paths),
											/**
											 * Prefer `<Link>` component over regular markdown links.
											 * Note that this also disables *parsing* regular markdown links.
											 */
											// link: false,
										},
										components: {
											...createCallout(paths, locale),
											// ...createDiagram(paths, locale),
											...createDisclosure(paths, locale),
											...createEmbed(paths, locale),
											...createFigure(paths, locale),
											...createFootnote(paths, locale),
											...createGrid(paths, locale),
											...createHeadingId(paths, locale),
											...createLink(paths, locale),
											...createLinkButton(paths, locale),
											...createTabs(paths, locale),
											...createVideo(paths, locale),
										},
									}),
								},
								{
									label: "Presentation",
								},
							),
							{
								label: "Presentations",
								validation: { length: { min: 0 } },
								itemLabel(props) {
									return props.fields.title.value;
								},
							},
						),
					},
					{
						label: "Session",
					},
				),
				{
					label: "Sessions",
					validation: { length: { min: 1 } },
					itemLabel(props) {
						return props.fields.title.value;
					},
				},
			),
			translations: fields.multiRelationship({
				label: "Translations",
				validation: { length: { min: 0 } },
				collection: withI18nPrefix("resources-events", locale),
			}),
			"is-translation-of": fields.relationship({
				label: "Is translation of",
				validation: { isRequired: false },
				collection: withI18nPrefix("resources-events", locale),
			}),
			"dariah-national-consortia": fields.multiRelationship({
				label: "DARIAH national consortia",
				validation: { length: { min: 0 } },
				collection: withI18nPrefix("dariah-national-consortia", locale),
				description: "DARIAH member countries contributing to resource (where applicable)",
			}),
			doi: readonly({
				label: "PID (readonly)",
				description: "Automatically assigned Handle PID.",
			}),
			draft: fields.ignored(),
		},
	});
});
