import {
	type GetStaticPathsContext,
	type GetStaticPathsResult,
	type GetStaticPropsContext,
	type GetStaticPropsResult,
} from "next";
import Image from "next/image";
import { type ParsedUrlQuery } from "querystring";
import { Fragment } from "react";

import EmailIcon from "@/assets/icons/at-symbol.svg?symbol";
import OrcidIcon from "@/assets/icons/brand/orcid.svg?symbol";
import TwitterIcon from "@/assets/icons/brand/twitter.svg?symbol";
import GlobeIcon from "@/assets/icons/globe-alt.svg?symbol";
import { type Person as PersonData } from "@/cms/api/people.api";
import { getPersonById, getPersonIds } from "@/cms/api/people.api";
import { type PostPreview } from "@/cms/api/posts.api";
import { getPostPreviewsByAuthorId } from "@/cms/queries/posts.queries";
import { getFullName } from "@/cms/utils/getFullName";
import { type Page } from "@/cms/utils/paginate";
import { getPageRange, paginate } from "@/cms/utils/paginate";
import { Icon } from "@/common/Icon";
import { LeadIn } from "@/common/LeadIn";
import { PageContent } from "@/common/PageContent";
import { PageTitle } from "@/common/PageTitle";
import { getLocale } from "@/i18n/getLocale";
import { type Dictionary } from "@/i18n/loadDictionary";
import { loadDictionary } from "@/i18n/loadDictionary";
import { useI18n } from "@/i18n/useI18n";
import { Metadata } from "@/metadata/Metadata";
import { useAlternateUrls } from "@/metadata/useAlternateUrls";
import { useCanonicalUrl } from "@/metadata/useCanonicalUrl";
import { routes } from "@/navigation/routes.config";
import { createUrl } from "@/utils/createUrl";
import { type ResourceListItem } from "@/views/post/getResourceListData";
import { getResourceListData } from "@/views/post/getResourceListData";
import { Pagination } from "@/views/post/Pagination";
import { ResourcesList } from "@/views/post/ResourcesList";

const pageSize = 12;

export interface AuthorPageParams extends ParsedUrlQuery {
	id: string;
	page: string;
}

export interface AuthorPageProps {
	dictionary: Dictionary;
	author: PersonData;
	resources: Page<ResourceListItem>;
}

/**
 * Creates page for every author.
 */
export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<AuthorPageParams>> {
	const { locales } = getLocale(context);

	const paths = (
		await Promise.all(
			locales.map(async (locale) => {
				const ids = await getPersonIds(locale);
				return (
					await Promise.all(
						ids.map(async (id) => {
							const posts = getResourceListData(await getPostPreviewsByAuthorId(id, locale));

							const pages = getPageRange(posts, pageSize);
							return pages.map((page) => {
								return {
									params: { id, page: String(page) },
									locale,
								};
							});
						}),
					)
				).flat();
			}),
		)
	).flat();

	return {
		paths,
		fallback: false,
	};
}

/**
 * Provides author metadata, metadata for posts authorged with that author and
 * translations for author page.
 */
export async function getStaticProps(
	context: GetStaticPropsContext<AuthorPageParams>,
): Promise<GetStaticPropsResult<AuthorPageProps>> {
	const { locale } = getLocale(context);

	const dictionary = await loadDictionary(locale, ["common"]);

	const { id } = context.params as AuthorPageParams;
	const author = await getPersonById(id, locale);

	const page = Number(context.params?.page);
	const postPreviews = await getPostPreviewsByAuthorId(id, locale);
	const sortedResources: Array<PostPreview> = postPreviews.sort((a, b) => {
		return a.date > b.date ? -1 : 1;
	});

	/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
	const resources = paginate(sortedResources, pageSize)[page - 1]!;

	return {
		props: {
			dictionary,
			author,
			resources,
		},
	};
}

/**
 * Author page.
 */
export default function AuthorPage(props: AuthorPageProps): JSX.Element {
	const { author, resources: posts } = props;

	const { t } = useI18n();
	const canonicalUrl = useCanonicalUrl();
	const languageAlternates = useAlternateUrls();

	const fullName = getFullName(author);

	return (
		<Fragment>
			<Metadata
				title={fullName}
				canonicalUrl={canonicalUrl}
				languageAlternates={languageAlternates}
			/>
			<PageContent className="w-full max-w-screen-xl px-4 py-8 mx-auto space-y-8 xs:py-16 xs:px-8">
				<div className="flex items-center justify-center space-x-4">
					{author.avatar != null ? (
						<div className="flex mb-4 border-2 rounded-full border-primary-600">
							<Image
								src={author.avatar}
								alt=""
								className="w-16 h-16 rounded-full object-cover"
								width={64}
								height={64}
							/>
						</div>
					) : null}
					<PageTitle>{fullName}</PageTitle>
				</div>
				<LeadIn>{author.description}</LeadIn>
				<dl className="flex items-center justify-center space-x-4 font-medium text-neutral-500">
					{author.email !== undefined ? (
						<div>
							<dt className="sr-only">Email</dt>
							<dd>
								<a href={`mailto:${author.email}`} className="flex items-center space-x-1">
									<Icon icon={EmailIcon} className="w-4 h-4" />
									<span>{author.email}</span>
								</a>
							</dd>
						</div>
					) : null}
					{author.website !== undefined ? (
						<div>
							<dt className="sr-only">Website</dt>
							<dd>
								<a href={author.website} className="flex items-center space-x-1">
									<Icon icon={GlobeIcon} className="w-4 h-4" />
									<span>{author.website}</span>
								</a>
							</dd>
						</div>
					) : null}
					{author.twitter !== undefined ? (
						<div>
							<dt className="sr-only">Twitter</dt>
							<dd>
								<a
									href={String(
										createUrl({
											pathname: author.twitter,
											baseUrl: "https://twitter.com",
										}),
									)}
									className="flex items-center space-x-1"
								>
									<Icon icon={TwitterIcon} className="w-4 h-4" />
									<span>{author.twitter}</span>
								</a>
							</dd>
						</div>
					) : null}
					{author.orcid !== undefined ? (
						<div>
							<dt className="sr-only">ORCID</dt>
							<dd>
								<a
									href={String(
										createUrl({
											pathname: author.orcid,
											baseUrl: "https://orcid.org",
										}),
									)}
									className="flex items-center space-x-1"
								>
									<Icon icon={OrcidIcon} className="w-4 h-4" />
									<span>{author.orcid}</span>
								</a>
							</dd>
						</div>
					) : null}
				</dl>
				<section className="space-y-5">
					<h2 className="sr-only">{t("common.resources")}</h2>
					<ResourcesList resources={posts.items} />
					<Pagination
						page={posts.page}
						pages={posts.pages}
						href={(page) => {
							return routes.author({ id: author.id, resourcePage: page });
						}}
					/>
				</section>
			</PageContent>
		</Fragment>
	);
}
