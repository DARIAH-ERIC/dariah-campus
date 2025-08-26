import type { Metadata } from "next";

interface CreateMetadataParams {
	authors: Array<string>;
	contributors?: Array<string>;
	license: string;
	locale: string;
	publicationDate: string;
	siteTitle: string;
	summary: string;
	tags: Array<string>;
	title: string;
	url: string;
}

export function createResourceMetadata(params: CreateMetadataParams): Metadata {
	const {
		authors,
		contributors,
		license,
		locale,
		publicationDate,
		siteTitle,
		summary,
		tags,
		title,
		url,
	} = params;

	const metadata: Metadata = {
		/**
		 * Open graph.
		 */
		openGraph: {
			type: "article",
			title,
			authors,
		},

		other: {
			/**
			 * Dublin Core.
			 */
			"schema.DCTERMS": "http://purl.org/dc/terms/",
			"schema.DC": "http://purl.org/dc/elements/1.1/",
			/** meta */
			"DC.title": title,
			"DC.creator": authors,
			"DC.contributor": contributors ?? [],
			"DC.subject": tags,
			"DC.language": locale,
			"DC.publisher": siteTitle,
			"DCTERMS.abstract": summary,
			"DCTERMS.issued": publicationDate,
			"DCTERMS.license": license,

			/**
			 * Highwire metadata is used by Google Scholar and Zotero.
			 *
			 * @see https://scholar.google.com/intl/en-us/scholar/inclusion.html#indexing
			 * @see https://github.com/zotero/translators/blob/master/Embedded%20Metadata.js#L42-L81
			 */
			citation_public_url: url,
			citation_title: title,
			citation_publication_date: publicationDate,
			citation_language: locale,
			citation_abstract: summary,
			citation_journal_title: siteTitle,
			citation_authors: authors,
		},
	};

	return metadata;
}
