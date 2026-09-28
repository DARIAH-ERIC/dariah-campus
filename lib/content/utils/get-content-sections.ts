import type { ContentSection } from "#/lib/content/mdx/with-content-sections.ts";

/**
 * Resolves the section to display from the `?section=` search parameter. Falls back to the first section, so an
 * outdated or hand-edited link still displays the document instead of a not-found page.
 */
export function getCurrentContentSection(
	sections: Array<ContentSection>,
	value: Array<string> | string | undefined,
): ContentSection | null {
	if (sections.length <= 1) {
		return null;
	}

	const id = Array.isArray(value) ? value.at(0) : value;

	return sections.find((section) => section.id === id) ?? sections[0]!;
}

/** Maps heading identifiers to the section they occur in, so table of contents entries can link across sections. */
export function getHeadingSections(sections: Array<ContentSection>): Record<string, string> {
	const headingSections: Record<string, string> = {};

	sections.forEach((section) => {
		section.headingIds.forEach((headingId) => {
			headingSections[headingId] = section.id;
		});
	});

	return headingSections;
}
