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
import { createPreviewUrl } from "@/lib/content/keystatic/utils/create-preview-url";
import { contentLanguages, contentLicenses, contentTypes } from "@/lib/content/options";

export const createResourcesHosted = createCollection("/resources/hosted/", (paths, locale) => {
	return collection({
		label: "Hosted resources",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		previewUrl: createPreviewUrl("/resources/hosted/{slug}"),
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
					...createDiagram(paths, locale),
					...createDisclosure(paths, locale),
					...createEmbed(paths, locale),
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
			doi: readonly({
				label: "PID (readonly)",
				description: "Automatically assigned Handle PID.",
			}),
			draft: fields.ignored(),
		},
	});
});
