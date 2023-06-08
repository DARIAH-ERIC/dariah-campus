import Head from "next/head";

import { type IsoDateString, type UrlString } from "@/utils/ts/aliases";

export interface HighwireProps {
	url: UrlString;
	title: string;
	date: IsoDateString;
	authors?: Array<string>;
	lang: string;
	abstract: string;
	siteTitle: string;
}

/**
 * Adds Highwire metadata, which is used by Google Scholar and Zotero.
 *
 * @see https://scholar.google.com/intl/en-us/scholar/inclusion.html#indexing
 * @see https://github.com/zotero/translators/blob/master/Embedded%20Metadata.js#L42-L81
 */
export function Highwire(props: HighwireProps): JSX.Element {
	const { title, date, authors, url, lang, abstract, siteTitle } = props;

	return (
		<Head>
			<meta key="citation_public_url" name="citation_public_url" content={url} />
			<meta key="citation_title" name="citation_title" content={title} />
			<meta key="citation_publication_date" name="citation_publication_date" content={date} />
			{authors?.map((author, index) => {
				return <meta key={`citation_author-${index}`} name="citation_author" content={author} />;
			})}
			<meta key="citation_language" name="citation_language" content={lang} />
			<meta key="citation_abstract" name="citation_abstract" content={abstract} />
			<meta key="citation_journal_title" name="citation_journal_title" content={siteTitle} />
		</Head>
	);
}
