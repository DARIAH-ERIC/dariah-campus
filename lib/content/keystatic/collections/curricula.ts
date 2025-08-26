import {
	createAssetOptions,
	createCollection,
	createContentFieldOptions,
	withI18nPrefix,
} from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

import { createCallout } from "@/lib/content/keystatic/components/callout";
import { createDiagram } from "@/lib/content/keystatic/components/diagram";
import { createDisclosure } from "@/lib/content/keystatic/components/disclosure";
import { createEmbed } from "@/lib/content/keystatic/components/embed";
import { createFigure } from "@/lib/content/keystatic/components/figure";
import { createFootnote } from "@/lib/content/keystatic/components/footnote";
import { createGrid } from "@/lib/content/keystatic/components/grid";
import { createHeadingId } from "@/lib/content/keystatic/components/heading-id";
import { createLink } from "@/lib/content/keystatic/components/link";
import { createLinkButton } from "@/lib/content/keystatic/components/link-button";
import { createQuiz } from "@/lib/content/keystatic/components/quiz";
import { createTabs } from "@/lib/content/keystatic/components/tabs";
import { createVideo } from "@/lib/content/keystatic/components/video";
import { createVideoCard } from "@/lib/content/keystatic/components/video-card";
import { readonly } from "@/lib/content/keystatic/fields/read-only";
// import { createPreviewUrl } from "@/lib/content/keystatic/utils/create-preview-url";
import { contentLanguages, contentLicenses } from "@/lib/content/options";

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
					...createDiagram(paths, locale),
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
			doi: readonly({
				label: "PID (readonly)",
				description: "Automatically assigned Handle PID.",
			}),
		},
	});
});
