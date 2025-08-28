import { createCollection, createContentFieldOptions } from "@acdh-oeaw/keystatic-lib";
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
import { createPreviewUrl } from "@/lib/content/keystatic/utils/create-preview-url";

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
				},
			}),
		},
	});
});
