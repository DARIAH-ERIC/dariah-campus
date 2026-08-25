import {
	createAssetOptions,
	createCollection,
	createContentFieldOptions,
	withI18nPrefix,
} from "@acdh-oeaw/keystatic-lib";
import { readonly } from "@acdh-oeaw/keystatic-lib/fields/readonly";
import { collection, fields } from "@keystatic/core";

import { createCallout } from "#/lib/content/keystatic/components/callout/index.tsx";
import { createCarousel } from "#/lib/content/keystatic/components/carousel/index.tsx";
// import { createDiagram } from "#/lib/content/keystatic/components/diagram/index.tsx";
import { createDisclosure } from "#/lib/content/keystatic/components/disclosure/index.tsx";
import { createEmbed } from "#/lib/content/keystatic/components/embed/index.tsx";
import { createFigure } from "#/lib/content/keystatic/components/figure/index.tsx";
import { createFootnote } from "#/lib/content/keystatic/components/footnote/index.tsx";
import { createGrid } from "#/lib/content/keystatic/components/grid/index.tsx";
import { createHeadingId } from "#/lib/content/keystatic/components/heading-id/index.tsx";
import { createImageLayers } from "#/lib/content/keystatic/components/image-layers/index.tsx";
import { createLinkButton } from "#/lib/content/keystatic/components/link-button/index.tsx";
import { createLink } from "#/lib/content/keystatic/components/link/index.tsx";
import { createQuiz } from "#/lib/content/keystatic/components/quiz/index.tsx";
// import { createQuiz } from "#/lib/content/keystatic/components/quiz/index.tsx";
import { createTabs } from "#/lib/content/keystatic/components/tabs/index.tsx";
import { createVideoCard } from "#/lib/content/keystatic/components/video-card/index.tsx";
import { createVideo } from "#/lib/content/keystatic/components/video/index.tsx";
import { createWorksheet } from "#/lib/content/keystatic/components/worksheet/index.tsx";
import { createPreviewUrl } from "#/lib/content/keystatic/utils/create-preview-url.ts";
import { contentLanguages, contentLicenses } from "#/lib/content/options.ts";

export const createCurricula = createCollection("/curricula/", (paths, locale) =>
	collection({
		label: "Curricula",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "form",
		previewUrl: createPreviewUrl("/curricula/{slug}"),
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
			sources: fields.multiRelationship({
				label: "Sources",
				validation: { length: { min: 0 } },
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
					 * Prefer `<Link>` component over regular markdown links. Note that this also disables _parsing_ regular
					 * markdown links.
					 */
					// link: false,
				},
				components: {
					...createCallout(paths, locale),
					...createCarousel(paths, locale),
					...createDisclosure(paths, locale),
					// ...createDiagram(paths, locale),
					...createWorksheet(paths, locale),
					...createEmbed(paths, locale),
					// ...createExternalResource(paths, locale),
					...createFigure(paths, locale),
					...createFootnote(paths, locale),
					...createGrid(paths, locale),
					...createHeadingId(paths, locale),
					...createImageLayers(paths, locale),
					...createLink(paths, locale),
					...createLinkButton(paths, locale),
					...createQuiz(paths, locale),
					...createTabs(paths, locale),
					...createVideo(paths, locale),
					...createVideoCard(paths, locale),
				},
			}),
			"supplementary-information": fields.mdx({
				label: "Supplementary information",
				description: "Use this for further reading, references, or other notes.",
				options: {
					...createContentFieldOptions(paths),
				},
				components: {
					...createCallout(paths, locale),
					...createCarousel(paths, locale),
					...createDisclosure(paths, locale),
					...createWorksheet(paths, locale),
					...createEmbed(paths, locale),
					...createFigure(paths, locale),
					...createFootnote(paths, locale),
					...createGrid(paths, locale),
					...createHeadingId(paths, locale),
					...createImageLayers(paths, locale),
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
				collection: withI18nPrefix("curricula", locale),
			}),
			"is-translation-of": fields.relationship({
				label: "Is translation of",
				validation: { isRequired: false },
				collection: withI18nPrefix("curricula", locale),
			}),
			"dariah-national-consortia": fields.multiRelationship({
				label: "DARIAH national consortia",
				validation: { length: { min: 0 } },
				collection: withI18nPrefix("dariah-national-consortia", locale),
				description: "DARIAH member countries contributing to resource (where applicable)",
			}),
			"dariah-working-groups": fields.multiRelationship({
				label: "DARIAH working groups",
				validation: { length: { min: 0 } },
				collection: withI18nPrefix("dariah-working-groups", locale),
				description: "DARIAH working groups contributing to resource (where applicable)",
			}),
			doi: readonly({
				label: "PID (readonly)",
				description: "Automatically assigned Handle PID.",
			}),
		},
	}),
);
