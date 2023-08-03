import { SchemaOrg as SchemaOrgMetadata } from "@stefanprobst/next-page-metadata";
import {
	type GetStaticPathsContext,
	type GetStaticPathsResult,
	type GetStaticPropsContext,
	type GetStaticPropsResult,
} from "next";
import { type ParsedUrlQuery } from "querystring";
import { Fragment } from "react";

import { type Event as EventData } from "@/cms/api/events.api";
import { getEventById, getEventIds } from "@/cms/api/events.api";
import { getFullName } from "@/cms/utils/getFullName";
import { getLocale } from "@/i18n/getLocale";
import { type Dictionary } from "@/i18n/loadDictionary";
import { loadDictionary } from "@/i18n/loadDictionary";
import { DublinCore as DublinCoreMetadata } from "@/metadata/DublinCore";
import { Highwire as HighwireMetadata } from "@/metadata/Highwire";
import { Metadata } from "@/metadata/Metadata";
import { useAlternateUrls } from "@/metadata/useAlternateUrls";
import { useCanonicalUrl } from "@/metadata/useCanonicalUrl";
import { useSiteMetadata } from "@/metadata/useSiteMetadata";
import { createUrl } from "@/utils/createUrl";
import { Event } from "@/views/post/Event";

export interface EventPageParams extends ParsedUrlQuery {
	id: string;
}

export interface EventPageProps {
	dictionary: Dictionary;
	resource: EventData;
}

/**
 * Creates page for every resource.
 */
export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<EventPageParams>> {
	const { locales } = getLocale(context);

	const paths = (
		await Promise.all(
			locales.map(async (locale) => {
				const ids = await getEventIds(locale);

				return ids.map((id) => {
					return {
						params: { id },
						locale,
					};
				});
			}),
		)
	).flat();

	return {
		paths,
		fallback: false,
	};
}

/**
 * Provides resource content and metadata, and translations for resource page.
 */
export async function getStaticProps(
	context: GetStaticPropsContext<EventPageParams>,
): Promise<GetStaticPropsResult<EventPageProps>> {
	const { locale } = getLocale(context);

	const dictionary = await loadDictionary(locale, ["common"]);

	const { id } = context.params as EventPageParams;

	const resource = await getEventById(id, locale);

	return {
		props: {
			dictionary,
			resource,
		},
	};
}

/**
 * Event page.
 */
export default function EventPage(props: EventPageProps): JSX.Element {
	const { resource } = props;
	const { metadata } = resource.data;

	const canonicalUrl = useCanonicalUrl();
	const languageAlternates = useAlternateUrls();
	const siteMetadata = useSiteMetadata();

	return (
		<Fragment>
			<Metadata
				title={metadata.title}
				canonicalUrl={canonicalUrl}
				languageAlternates={languageAlternates}
				openGraph={{
					type: "article",
				}}
			/>
			<SchemaOrgMetadata
				schema={{
					"@type": "LearningResource",
					url: canonicalUrl,
					headline: metadata.title,
					datePublished: metadata.date,
					abstract: metadata.abstract,
					inLanguage: metadata.lang,
					author: metadata.authors.map((author) => {
						return {
							"@type": "Person",
							familyName: author.lastName,
							givenName: author.firstName,
						};
					}),
					license: metadata.licence.url,
					image:
						typeof metadata.featuredImage === "string"
							? metadata.featuredImage
							: metadata.featuredImage?.src,
					keywords: metadata.tags.map((tag) => {
						return tag.name;
					}),
					publisher: {
						"@type": "Organization",
						name: siteMetadata.title,
						description: siteMetadata.description,
						url: siteMetadata.url,
						logo: siteMetadata.image.publicPath,
						sameAs:
							siteMetadata.twitter != null
								? String(
										createUrl({
											pathname: siteMetadata.twitter,
											baseUrl: "https://twitter.com",
										}),
								  )
								: undefined,
					},
				}}
			/>
			<HighwireMetadata
				url={canonicalUrl}
				title={metadata.title}
				date={metadata.date}
				authors={metadata.authors.map((author) => {
					return getFullName(author);
				})}
				abstract={metadata.abstract}
				lang={metadata.lang}
				siteTitle={siteMetadata.title}
			/>
			<DublinCoreMetadata
				title={metadata.title}
				date={metadata.date}
				authors={metadata.authors.map((author) => {
					return getFullName(author);
				})}
				abstract={metadata.abstract}
				lang={metadata.lang}
				licence={metadata.licence.name}
				tags={metadata.tags.map((tag) => {
					return tag.name;
				})}
				siteTitle={siteMetadata.title}
			/>
			<Event event={resource} />
		</Fragment>
	);
}
