import {
	type GetStaticPathsContext,
	type GetStaticPathsResult,
	type GetStaticPropsContext,
	type GetStaticPropsResult,
} from "next";
import { type ParsedUrlQuery } from "querystring";
import { Fragment } from "react";

import { getEventIds, getEventPreviews } from "@/cms/api/events.api";
import { getPostIds, getPostPreviews } from "@/cms/api/posts.api";
import { getTags } from "@/cms/api/tags.api";
import { getEventPreviewsByTagId } from "@/cms/queries/events.queries";
import { getPostPreviewsByTagId } from "@/cms/queries/posts.queries";
import { isResourceHidden } from "@/cms/utils/isResourceHidden";
import { type Page } from "@/cms/utils/paginate";
import { getPageRange, paginate } from "@/cms/utils/paginate";
import { Accordion } from "@/common/Accordion";
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
import { type ResourceListItem } from "@/views/post/getResourceListData";
import { getResourceListData } from "@/views/post/getResourceListData";
import { type TagListItem } from "@/views/post/getTagListData";
import { Pagination } from "@/views/post/Pagination";
import { ResourcesList } from "@/views/post/ResourcesList";
import { TagsList } from "@/views/post/TagsList";

const pageSize = 12;
const tagsPageSize = 50;

type TagWithPostCount = TagListItem & { posts: number };

export interface ResourcesPageParams extends ParsedUrlQuery {
	page: string;
}

export interface ResourcesPageProps {
	dictionary: Dictionary;
	resources: Page<ResourceListItem>;
	tags: Array<TagWithPostCount>;
}

/**
 * Creates resources pages.
 */
export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<ResourcesPageParams>> {
	const { locales } = getLocale(context);

	const paths = (
		await Promise.all(
			locales.map(async (locale) => {
				const postIds = await getPostIds(locale);
				const eventIds = await getEventIds(locale);
				const ids = [...postIds, ...eventIds];

				const pages = getPageRange(ids, pageSize);
				return pages.map((page) => {
					return {
						params: { page: String(page) },
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
 * Provides translations and metadata for resources page.
 */
export async function getStaticProps(
	context: GetStaticPropsContext<ResourcesPageParams>,
): Promise<GetStaticPropsResult<ResourcesPageProps>> {
	const { locale } = getLocale(context);

	const dictionary = await loadDictionary(locale, ["common"]);

	const page = Number(context.params?.page);
	const postPreviews = await getPostPreviews(locale);
	const eventPreviews = await getEventPreviews(locale);
	const resourcePreviews = getResourceListData([
		...postPreviews.filter((preview) => {
			return !isResourceHidden(preview.draft);
		}),
		...eventPreviews,
	]);
	const sortedResources: Array<ResourceListItem> = resourcePreviews.sort((a, b) => {
		return a.date > b.date ? -1 : 1;
	});

	/**
	 * Note that we need to guard against `undefined` here, because the page
	 * number calculation in `getStaticPaths` takes *all* resource ids into
	 * account when calculating the pages, while here we filter out any
	 * resources with `draft: true` via `isResourceHidden()`.
	 *
	 * We *could* take the `draft` frontmatter field into account in `getStaticPaths`,
	 * but since `getStaticPaths` and `getStaticProps` run in different workers,
	 * they cannot share state, so we would unnecessarily parse *every* resource,
	 * just to be able to read the `draft` field.
	 *
	 * In the worst case, this can generate an empty page, which can be accessed
	 * by entering the corresponding URL, e.g. `/resources/page/13`, but it will
	 * *not* be linked with a "Next page" link, so this should be fine.
	 */
	const resources =
		paginate(sortedResources, pageSize)[page - 1] ??
		({
			items: [],
			page,
			pages: getPageRange(sortedResources, pageSize).length,
		} as Page<ResourceListItem>);

	const tags = await getTags(locale);
	const tagsWithPostCount = (
		await Promise.all(
			tags.map(async (tag) => {
				const postsWithTag = await getPostPreviewsByTagId(tag.id, locale);
				const eventsWithTag = await getEventPreviewsByTagId(tag.id, locale);

				return {
					id: tag.id,
					name: tag.name,
					posts: postsWithTag.length + eventsWithTag.length,
				};
			}),
		)
	)
		.filter((tag) => {
			return tag.posts > 0;
		})
		.sort((a, b) => {
			return a.posts > b.posts ? -1 : 1;
		})
		/** Display only the first page of tags with highest number of posts. */
		.slice(0, tagsPageSize);

	return {
		props: {
			dictionary,
			resources,
			tags: tagsWithPostCount,
		},
	};
}

/**
 * Resources page.
 */
export default function ResourcesPage(props: ResourcesPageProps): JSX.Element {
	const { resources, tags } = props;

	const { t } = useI18n();
	const canonicalUrl = useCanonicalUrl();
	const languageAlternates = useAlternateUrls();

	return (
		<Fragment>
			<Metadata
				title={t("common.page.resources")}
				canonicalUrl={canonicalUrl}
				languageAlternates={languageAlternates}
			/>
			<PageContent className="flex flex-col w-full max-w-screen-xl px-4 py-8 mx-auto space-y-10 xs:py-16 xs:px-8">
				<PageTitle>{t("common.posts")}</PageTitle>
				<Accordion style={{ maxWidth: "100%" }}>
					<Accordion.Item key="topic" title="Filter by topic" hasChildItems={false}>
						<TagsList tags={tags} />
					</Accordion.Item>
				</Accordion>
				<ResourcesList resources={resources.items} />
				<Pagination
					page={resources.page}
					pages={resources.pages}
					href={(page) => {
						return routes.resources({ page });
					}}
				/>
			</PageContent>
		</Fragment>
	);
}
