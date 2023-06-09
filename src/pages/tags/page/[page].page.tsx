import {
	type GetStaticPathsContext,
	type GetStaticPathsResult,
	type GetStaticPropsContext,
	type GetStaticPropsResult,
} from "next";
import Image from "next/image";
import { type ParsedUrlQuery } from "querystring";
import { Fragment } from "react";

import { getTagIds, getTags } from "@/cms/api/tags.api";
import { getEventPreviewsByTagId } from "@/cms/queries/events.queries";
import { getPostPreviewsByTagId } from "@/cms/queries/posts.queries";
import { type Page } from "@/cms/utils/paginate";
import { getPageRange, paginate } from "@/cms/utils/paginate";
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
import { type TagListItem } from "@/views/post/getTagListData";
import { TagsList } from "@/views/post/TagsList";
import HeroImage from "~/public/assets/images/study.svg";

const pageSize = 500;

type TagWithPostCount = TagListItem & { posts: number };

export interface TagsPageParams extends ParsedUrlQuery {
	page: string;
}

export interface TagsPageProps {
	dictionary: Dictionary;
	tags: Page<TagWithPostCount>;
}

/**
 * Creates tags pages.
 */
export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<TagsPageParams>> {
	const { locales } = getLocale(context);

	const paths = (
		await Promise.all(
			locales.map(async (locale) => {
				const ids = await getTagIds(locale);
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
 * Provides metadata and translations for tags page.
 */
export async function getStaticProps(
	context: GetStaticPropsContext<TagsPageParams>,
): Promise<GetStaticPropsResult<TagsPageProps>> {
	const { locale } = getLocale(context);

	const dictionary = await loadDictionary(locale, ["common"]);

	const page = Number(context.params?.page);
	/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
	const tags = paginate(await getTags(locale), pageSize)[page - 1]!;
	const tagsWithPostCount = (
		await Promise.all(
			tags.items.map(async (tag) => {
				const postsWithTag = await getPostPreviewsByTagId(tag.id, locale);
				const eventsWithTag = await getEventPreviewsByTagId(tag.id, locale);
				const resourcesWithTag = [...postsWithTag, ...eventsWithTag];

				return {
					id: tag.id,
					name: tag.name,
					posts: resourcesWithTag.length,
				};
			}),
		)
	).filter((tag) => {
		return tag.posts > 0;
	}); // FIXME: paginate after filtering - needs caching!

	return {
		props: {
			dictionary,
			tags: { ...tags, items: tagsWithPostCount },
		},
	};
}

/**
 * Tags page.
 */
export default function TagsPage(props: TagsPageProps): JSX.Element {
	const { tags } = props;

	const { t } = useI18n();
	const canonicalUrl = useCanonicalUrl();
	const languageAlternates = useAlternateUrls();

	return (
		<Fragment>
			<Metadata
				title={t("common.page.tags")}
				canonicalUrl={canonicalUrl}
				languageAlternates={languageAlternates}
			/>
			<PageContent className="flex flex-col w-full max-w-screen-xl px-4 py-8 mx-auto space-y-10 xs:py-16 xs:px-8">
				<Image alt="" className="h-56 text-primary-600 mx-auto" src={HeroImage} />
				<PageTitle>{t("common.tagsPageTitle")}</PageTitle>
				<LeadIn>{t("common.tagsPageLeadIn")}</LeadIn>
				<TagsList tags={tags.items} />
			</PageContent>
		</Fragment>
	);
}
