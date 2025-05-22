import {
	createAssetOptions,
	createCollection,
	createContentFieldOptions,
	withI18nPrefix,
} from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";
import slugify from "@sindresorhus/slugify";

import {
	contentLanguages,
	contentLicenses,
	contentTypes,
	socialMediaKinds,
} from "@/lib/content/options";
import {
	createCallout,
	createDisclosure,
	createEmbed,
	createExternalResource,
	createFigure,
	createFootnote,
	createGrid,
	createHeadingId,
	createLink,
	createLinkButton,
	createQuiz,
	// createTableOfContents,
	createTabs,
	createVideo,
	createVideoCard,
} from "@/lib/keystatic/components";
// import { createPreviewUrl } from "@/lib/keystatic/create-preview-url";
import * as _fields from "@/lib/keystatic/fields";
import * as validation from "@/lib/keystatic/validation";

export const createCurricula = createCollection("/curricula/", (paths, locale) => {
	return collection({
		label: "Curricula",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		// previewUrl: createPreviewUrl("/curricula/{slug}"),
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
			version: fields.text({
				label: "Version",
				defaultValue: "1.0.0",
			}),
			editors: fields.multiRelationship({
				label: "Editors",
				validation: { length: { min: 1 } },
				collection: withI18nPrefix("people", locale),
			}),
			tags: fields.multiRelationship({
				label: "Tags",
				validation: { length: { min: 1 } },
				collection: withI18nPrefix("tags", locale),
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
			summary: fields.object(
				{
					title: fields.text({
						label: "Summary title",
						validation: { isRequired: false },
					}),
					content: fields.text({
						label: "Summary",
						validation: { isRequired: true },
						multiline: true,
					}),
				},
				{
					label: "Summary",
				},
			),
			resources: fields.array(
				fields.conditional(
					fields.select({
						label: "Collection",
						options: [
							{ label: "Hosted resources", value: "resources-hosted" },
							{ label: "Captured events", value: "resources-events" },
							{ label: "Pathfinder resources", value: "resources-pathfinders" },
							{ label: "External resources", value: "resources-external" },
						],
						defaultValue: "resources-hosted",
					}),
					{
						"resources-events": fields.relationship({
							label: "Event",
							validation: { isRequired: true },
							collection: withI18nPrefix("resources-events", locale),
						}),
						"resources-external": fields.relationship({
							label: "External resource",
							validation: { isRequired: true },
							collection: withI18nPrefix("resources-external", locale),
						}),
						"resources-hosted": fields.relationship({
							label: "Hosted resource",
							validation: { isRequired: true },
							collection: withI18nPrefix("resources-hosted", locale),
						}),
						"resources-pathfinders": fields.relationship({
							label: "Pathfinder",
							validation: { isRequired: true },
							collection: withI18nPrefix("resources-pathfinders", locale),
						}),
					},
				),
				{
					label: "Resources",
					itemLabel(props) {
						return `${props.value.value ?? ""} (${props.discriminant})`;
					},
					validation: { length: { min: 1 } },
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
					...createDisclosure(paths, locale),
					...createEmbed(paths, locale),
					// ...createExternalResource(paths, locale),
					...createFigure(paths, locale),
					...createFootnote(paths, locale),
					...createGrid(paths, locale),
					...createHeadingId(paths, locale),
					...createLink(paths, locale),
					...createLinkButton(paths, locale),
					...createQuiz(paths, locale),
					...createTabs(paths, locale),
					...createVideo(paths, locale),
					...createVideoCard(paths, locale),
				},
			}),
			translations: fields.multiRelationship({
				label: "Translations",
				validation: { length: { min: 0 } },
				collection: withI18nPrefix("curricula", locale),
			}),
			doi: _fields.identifier({
				label: "PID (readonly)",
				description: "Automatically assigned Handle PID.",
			}),
		},
	});
});

export const createDocumentation = createCollection("/documentation/", (paths, locale) => {
	return collection({
		label: "Documentation",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		// previewUrl: createPreviewUrl("/documentation/{slug}"),
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			lead: fields.text({
				label: "Lead",
				validation: { isRequired: true },
				multiline: true,
			}),
			// publicationDate: fields.date({
			// 	label: "Publication date",
			// 	validation: { isRequired: true },
			// 	defaultValue: { kind: "today" },
			// }),
			// image: fields.image({
			// 	label: "Image",
			// 	validation: { isRequired: true },
			// 	...createAssetOptions(paths.assetPath),
			// }),
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
					...createDisclosure(paths, locale),
					...createEmbed(paths, locale),
					// ...createExternalResource(paths, locale),
					...createFigure(paths, locale),
					...createFootnote(paths, locale),
					...createGrid(paths, locale),
					...createHeadingId(paths, locale),
					...createLink(paths, locale),
					...createLinkButton(paths, locale),
					...createQuiz(paths, locale),
					...createTabs(paths, locale),
					...createVideo(paths, locale),
					// ...createVideoCard(paths, locale),
				},
			}),
		},
	});
});

export const createEvents = createCollection("/resources/events/", (paths, locale) => {
	return collection({
		label: "Events",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "form",
		// previewUrl: createPreviewUrl("/resources/events/{slug}"),
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
					...createDisclosure(paths, locale),
					...createEmbed(paths, locale),
					// ...createExternalResource(paths, locale),
					...createFigure(paths, locale),
					...createFootnote(paths, locale),
					...createGrid(paths, locale),
					...createHeadingId(paths, locale),
					...createLink(paths, locale),
					...createLinkButton(paths, locale),
					// ...createQuiz(paths, locale),
					...createTabs(paths, locale),
					...createVideo(paths, locale),
					// ...createVideoCard(paths, locale),
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
								...createDisclosure(paths, locale),
								...createEmbed(paths, locale),
								// ...createExternalResource(paths, locale),
								...createFigure(paths, locale),
								...createFootnote(paths, locale),
								...createGrid(paths, locale),
								...createHeadingId(paths, locale),
								...createLink(paths, locale),
								...createLinkButton(paths, locale),
								// ...createQuiz(paths, locale),
								...createTabs(paths, locale),
								...createVideo(paths, locale),
								// ...createVideoCard(paths, locale),
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
											...createDisclosure(paths, locale),
											...createEmbed(paths, locale),
											// ...createExternalResource(paths, locale),
											...createFigure(paths, locale),
											...createFootnote(paths, locale),
											...createGrid(paths, locale),
											...createHeadingId(paths, locale),
											...createLink(paths, locale),
											...createLinkButton(paths, locale),
											// ...createQuiz(paths, locale),
											...createTabs(paths, locale),
											...createVideo(paths, locale),
											// ...createVideoCard(paths, locale),
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
			doi: _fields.identifier({
				label: "PID (readonly)",
				description: "Automatically assigned Handle PID.",
			}),
			draft: fields.ignored(),
		},
	});
});

export const createPeople = createCollection("/people/", (paths, _locale) => {
	return collection({
		label: "People",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "name",
		columns: ["name"],
		entryLayout: "form",
		// previewUrl: createPreviewUrl("/people/{slug}"),
		schema: {
			name: fields.slug({
				name: {
					label: "Name",
					validation: { isRequired: true },
				},
				slug: {
					generate(name) {
						const segments = name.trim().split(" ");
						const lastName = segments.pop();
						return slugify([lastName, ...segments].join(" "));
					},
				},
			}),
			image: fields.image({
				label: "Image",
				validation: { isRequired: true },
				...createAssetOptions(paths.assetPath),
			}),
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
						facebook: fields.url({
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
			content: fields.mdx({
				label: "Description",
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
	});
});

export const createResourcesExternal = createCollection("/resources/external/", (paths, locale) => {
	return collection({
		label: "External resources",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		// previewUrl: createPreviewUrl("/resources/external/{slug}"),
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
			version: fields.text({
				label: "Version",
				defaultValue: "1.0.0",
			}),
			authors: fields.multiRelationship({
				label: "Authors",
				validation: { length: { min: 1 } },
				collection: withI18nPrefix("people", locale),
			}),
			editors: fields.multiRelationship({
				label: "Editors",
				validation: { length: { min: 0 } },
				collection: withI18nPrefix("people", locale),
			}),
			contributors: fields.multiRelationship({
				label: "Contributors",
				validation: { length: { min: 0 } },
				collection: withI18nPrefix("people", locale),
			}),
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
				defaultValue: false,
			}),
			summary: fields.object(
				{
					title: fields.text({
						label: "Summary title",
						validation: { isRequired: false },
					}),
					content: fields.text({
						label: "Summary",
						validation: { isRequired: true },
						multiline: true,
					}),
				},
				{
					label: "Summary",
				},
			),
			remote: fields.object(
				{
					"publication-date": fields.date({
						label: "Publication date",
						validation: { isRequired: true },
					}),
					url: fields.url({
						label: "URL",
						validation: { isRequired: true },
					}),
					publisher: fields.text({
						label: "Publisher",
						validation: { isRequired: true },
					}),
				},
				{
					label: "Remote host",
				},
			),
			"content-type": fields.select({
				label: "Content type",
				options: contentTypes,
				defaultValue: "training-module",
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
					// ...createDisclosure(paths, locale),
					// ...createEmbed(paths, locale),
					...createExternalResource(paths, locale),
					...createFigure(paths, locale),
					// ...createFootnote(paths, locale),
					...createGrid(paths, locale),
					...createHeadingId(paths, locale),
					...createLink(paths, locale),
					...createLinkButton(paths, locale),
					...createQuiz(paths, locale),
					// ...createTabs(paths, locale),
					...createVideo(paths, locale),
					...createVideoCard(paths, locale),
				},
			}),
			translations: fields.multiRelationship({
				label: "Translations",
				validation: { length: { min: 0 } },
				collection: withI18nPrefix("resources-external", locale),
			}),
			doi: _fields.identifier({
				label: "PID (readonly)",
				description: "Automatically assigned Handle PID.",
			}),
			draft: fields.ignored(),
		},
	});
});

export const createResourcesHosted = createCollection("/resources/hosted/", (paths, locale) => {
	return collection({
		label: "Hosted resources",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		// previewUrl: createPreviewUrl("/resources/hosted/{slug}"),
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
			version: fields.text({
				label: "Version",
				defaultValue: "1.0.0",
			}),
			authors: fields.multiRelationship({
				label: "Authors",
				validation: { length: { min: 1 } },
				collection: withI18nPrefix("people", locale),
			}),
			editors: fields.multiRelationship({
				label: "Editors",
				// validation: { length: { min: 0 } },
				collection: withI18nPrefix("people", locale),
			}),
			contributors: fields.multiRelationship({
				label: "Contributors",
				// validation: { length: { min: 0 } },
				collection: withI18nPrefix("people", locale),
			}),
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
			summary: fields.object(
				{
					title: fields.text({
						label: "Summary title",
						validation: { isRequired: false },
					}),
					content: fields.text({
						label: "Summary",
						validation: { isRequired: true },
						multiline: true,
					}),
				},
				{
					label: "Summary",
				},
			),
			"content-type": fields.select({
				label: "Content type",
				options: contentTypes,
				defaultValue: "training-module",
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
					...createDisclosure(paths, locale),
					...createEmbed(paths, locale),
					// ...createExternalResource(paths, locale),
					...createFigure(paths, locale),
					...createFootnote(paths, locale),
					...createGrid(paths, locale),
					...createHeadingId(paths, locale),
					...createLink(paths, locale),
					...createLinkButton(paths, locale),
					...createQuiz(paths, locale),
					...createTabs(paths, locale),
					...createVideo(paths, locale),
					...createVideoCard(paths, locale),
				},
			}),
			translations: fields.multiRelationship({
				label: "Translations",
				validation: { length: { min: 0 } },
				collection: withI18nPrefix("resources-hosted", locale),
			}),
			doi: _fields.identifier({
				label: "PID (readonly)",
				description: "Automatically assigned Handle PID.",
			}),
			draft: fields.ignored(),
		},
	});
});

export const createResourcesPathfinders = createCollection(
	"/resources/pathfinders/",
	(paths, locale) => {
		return collection({
			label: "Pathfinders",
			path: paths.contentPath,
			format: { contentField: "content" },
			slugField: "title",
			columns: ["title"],
			entryLayout: "content",
			// previewUrl: createPreviewUrl("/resources/pathfinders/{slug}"),
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
				version: fields.text({
					label: "Version",
					defaultValue: "1.0.0",
				}),
				authors: fields.multiRelationship({
					label: "Authors",
					validation: { length: { min: 1 } },
					collection: withI18nPrefix("people", locale),
				}),
				editors: fields.multiRelationship({
					label: "Editors",
					// validation: { length: { min: 0 } },
					collection: withI18nPrefix("people", locale),
				}),
				contributors: fields.multiRelationship({
					label: "Contributors",
					// validation: { length: { min: 0 } },
					collection: withI18nPrefix("people", locale),
				}),
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
				summary: fields.object(
					{
						title: fields.text({
							label: "Summary title",
							validation: { isRequired: false },
						}),
						content: fields.text({
							label: "Summary",
							validation: { isRequired: true },
							multiline: true,
						}),
					},
					{
						label: "Summary",
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
						...createDisclosure(paths, locale),
						...createEmbed(paths, locale),
						// ...createExternalResource(paths, locale),
						...createFigure(paths, locale),
						...createFootnote(paths, locale),
						...createGrid(paths, locale),
						...createHeadingId(paths, locale),
						...createLink(paths, locale),
						...createLinkButton(paths, locale),
						// ...createQuiz(paths, locale),
						...createTabs(paths, locale),
						...createVideo(paths, locale),
						// ...createVideoCard(paths, locale),
					},
				}),
				translations: fields.multiRelationship({
					label: "Translations",
					validation: { length: { min: 0 } },
					collection: withI18nPrefix("resources-pathfinders", locale),
				}),
				doi: _fields.identifier({
					label: "PID (readonly)",
					description: "Automatically assigned Handle PID.",
				}),
				draft: fields.ignored(),
			},
		});
	},
);

export const createSources = createCollection("/sources/", (paths, _locale) => {
	return collection({
		label: "Sources",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "name",
		columns: ["name"],
		entryLayout: "form",
		// previewUrl: createPreviewUrl("/sources/{slug}"),
		schema: {
			name: fields.slug({
				name: {
					label: "Name",
					validation: { isRequired: true },
				},
			}),
			image: fields.image({
				label: "Image",
				validation: { isRequired: true },
				...createAssetOptions(paths.assetPath),
			}),
			content: fields.mdx({
				label: "Description",
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
	});
});

export const createTags = createCollection("/tags/", (paths, _locale) => {
	return collection({
		label: "Tags",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "name",
		columns: ["name"],
		entryLayout: "form",
		// previewUrl: createPreviewUrl("/tags/{slug}"),
		schema: {
			name: fields.slug({
				name: {
					label: "Name",
					validation: { isRequired: true },
				},
			}),
			content: fields.mdx({
				label: "Description",
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
	});
});
