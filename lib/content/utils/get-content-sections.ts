import type { ContentSection } from "#/lib/content/mdx/with-content-sections.ts";

export interface ContentSectionLink {
	id: string;
	href: string;
}

/**
 * Resolves the section to display from the `[section]` route segment. Falls back to the first section, so an outdated
 * or hand-edited link still displays the document instead of a not-found page.
 */
export function getCurrentContentSection(
	sections: Array<ContentSection>,
	id: string | undefined,
): ContentSection | null {
	if (sections.length <= 1) {
		return null;
	}

	return sections.find((section) => section.id === id) ?? sections[0]!;
}

/**
 * Sections are addressed via path segment rather than search param, because search params are not available on
 * statically generated pages in draft mode when deployed to vercel.
 *
 * The first section is displayed at the document url itself.
 *
 * @see https://github.com/vercel/next.js/issues/92562
 */
export function getContentSectionHref(href: string, sections: Array<ContentSection>, id: string): string {
	if (sections[0]?.id === id) {
		return href;
	}

	return `${href}/${encodeURIComponent(id)}`;
}

/** Urls of all sections except the first, which is displayed at the document url itself. */
export function getContentSectionHrefs(href: string, sections: Array<ContentSection>): Array<string> {
	return sections.slice(1).map((section) => getContentSectionHref(href, sections, section.id));
}

/** Values of the `[section]` route segment, i.e. identifiers of all sections except the first. */
export function getContentSectionSegments(sections: Array<ContentSection>): Array<string> {
	return sections.slice(1).map((section) => section.id);
}

/** Maps heading identifiers to the section they occur in, so table of contents entries can link across sections. */
export function getHeadingSections(href: string, sections: Array<ContentSection>): Record<string, ContentSectionLink> {
	const headingSections: Record<string, ContentSectionLink> = {};

	sections.forEach((section) => {
		const link = { id: section.id, href: getContentSectionHref(href, sections, section.id) };

		section.headingIds.forEach((headingId) => {
			headingSections[headingId] = link;
		});
	});

	return headingSections;
}
