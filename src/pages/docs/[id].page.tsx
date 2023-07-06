import {
	type GetStaticPathsContext,
	type GetStaticPathsResult,
	type GetStaticPropsContext,
	type GetStaticPropsResult,
} from "next";
import { type ParsedUrlQuery } from "querystring";
import { Fragment } from "react";

import { type Doc as DocData, type DocPreview } from "@/cms/api/docs.api";
import { getDocById, getDocFilePath, getDocIds, getDocPreviews } from "@/cms/api/docs.api";
import { getLastUpdatedTimestamp } from "@/cms/utils/getLastUpdatedTimestamp";
import { PageContent } from "@/common/PageContent";
import { getLocale } from "@/i18n/getLocale";
import { type Dictionary } from "@/i18n/loadDictionary";
import { loadDictionary } from "@/i18n/loadDictionary";
import { Metadata } from "@/metadata/Metadata";
import { useAlternateUrls } from "@/metadata/useAlternateUrls";
import { useCanonicalUrl } from "@/metadata/useCanonicalUrl";
import { type IsoDateString } from "@/utils/ts/aliases";
import { Docs } from "@/views/docs/Docs";
import { DocsNav } from "@/views/docs/DocsNav";
import { FloatingTableOfContents } from "@/views/post/FloatingTableOfContents";
import { TableOfContents } from "@/views/post/TableOfContents";

export interface DocsPageParams extends ParsedUrlQuery {
	id: string;
}

export interface DocsPageProps {
	dictionary: Dictionary;
	docs: DocData;
	lastUpdatedAt: IsoDateString | null;
	nav: Array<DocPreview>;
}

/**
 * Creates docs pages.
 */
export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<DocsPageParams>> {
	const { locales } = getLocale(context);

	const paths = (
		await Promise.all(
			locales.map(async (locale) => {
				const ids = await getDocIds(locale);
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
 * Provides translations for docs page.
 */
export async function getStaticProps(
	context: GetStaticPropsContext<DocsPageParams>,
): Promise<GetStaticPropsResult<DocsPageProps>> {
	const { locale } = getLocale(context);

	const dictionary = await loadDictionary(locale, ["common"]);

	const { id } = context.params as DocsPageParams;
	const docs = await getDocById(id, locale);
	const lastUpdatedAt = await getLastUpdatedTimestamp(getDocFilePath(id, locale));

	const nav = await getDocPreviews(locale);

	return {
		props: {
			dictionary,
			docs,
			lastUpdatedAt,
			nav,
		},
	};
}

/**
 * Docs page.
 */
export default function DocsPage(props: DocsPageProps): JSX.Element {
	const { docs, lastUpdatedAt, nav } = props;
	const { metadata, toc } = docs.data;

	const canonicalUrl = useCanonicalUrl();
	const languageAlternates = useAlternateUrls();

	return (
		<Fragment>
			<Metadata
				title={metadata.title}
				canonicalUrl={canonicalUrl}
				languageAlternates={languageAlternates}
			/>
			<PageContent className="grid w-full max-w-screen-lg px-4 py-8 mx-auto space-y-24 xs:py-16 xs:px-8 2xl:grid-cols-content-layout 2xl:space-y-0 2xl:gap-x-10 2xl:max-w-none">
				<aside
					className="sticky hidden w-full max-w-xs max-h-screen px-8 space-y-8 overflow-y-auto text-sm top-24 text-neutral-500 2xl:flex 2xl:flex-col justify-self-end"
					style={{
						maxHeight: "calc(100vh - 12px - var(--page-header-height))",
					}}
				>
					<DocsNav nav={nav} />
				</aside>
				<Docs docs={docs} lastUpdatedAt={lastUpdatedAt} nav={nav} />
				{toc.length > 0 ? (
					<Fragment>
						<aside
							className="sticky hidden w-full max-w-xs max-h-screen px-10 overflow-y-auto text-sm top-24 2xl:block text-neutral-500"
							style={{
								maxHeight: "calc(100vh - 12px - var(--page-header-height))",
							}}
						>
							<TableOfContents
								toc={toc}
								title={
									<h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">{`Table of contents`}</h2>
								}
								className="space-y-2"
							/>
						</aside>
						<aside className="2xl:hidden">
							<FloatingTableOfContents toc={toc} />
						</aside>
					</Fragment>
				) : null}
			</PageContent>
		</Fragment>
	);
}
