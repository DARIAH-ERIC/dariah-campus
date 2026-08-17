import { createCollection, createContentFieldOptions } from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

import { createCallout } from "#/lib/content/keystatic/components/callout/index.tsx";
// import { createDiagram } from "#/lib/content/keystatic/components/diagram/index.tsx";
import { createDisclosure } from "#/lib/content/keystatic/components/disclosure/index.tsx";
import { createEmbed } from "#/lib/content/keystatic/components/embed/index.tsx";
import { createFigure } from "#/lib/content/keystatic/components/figure/index.tsx";
import { createFootnote } from "#/lib/content/keystatic/components/footnote/index.tsx";
import { createGrid } from "#/lib/content/keystatic/components/grid/index.tsx";
import { createHeadingId } from "#/lib/content/keystatic/components/heading-id/index.tsx";
import { createLink } from "#/lib/content/keystatic/components/link/index.tsx";
import { createLinkButton } from "#/lib/content/keystatic/components/link-button/index.tsx";
import { createQuiz } from "#/lib/content/keystatic/components/quiz/index.tsx";
import { createTabs } from "#/lib/content/keystatic/components/tabs/index.tsx";
import { createVideo } from "#/lib/content/keystatic/components/video/index.tsx";
import { createPreviewUrl } from "#/lib/content/keystatic/utils/create-preview-url.ts";

export const createDocumentation = createCollection("/documentation/", (paths, locale) => {
	return collection({
		label: "Documentation",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		previewUrl: createPreviewUrl("/documentation/{slug}"),
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
					// ...createDiagram(paths, locale),
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
				},
			}),
		},
	});
});
