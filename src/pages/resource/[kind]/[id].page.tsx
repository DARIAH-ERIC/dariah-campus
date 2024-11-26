import { SchemaOrg as SchemaOrgMetadata } from "@stefanprobst/next-page-metadata";
import {
	type GetStaticPathsContext,
	type GetStaticPathsResult,
	type GetStaticPropsContext,
	type GetStaticPropsResult,
} from "next";
import Link from "next/link";
import { type ParsedUrlQuery } from "querystring";
import { Fragment } from "react";

import AcademicCapIcon from "@/assets/icons/academic-cap.svg?symbol";
import { getEventById, getEventIds } from "@/cms/api/events.api";
import {
	getPostById,
	getPostFilePath,
	getPostIds,
	type Post as PostData,
} from "@/cms/api/posts.api";
import { type Resource as ResourceData, type ResourceKind } from "@/cms/api/resources.api";
import { getCoursePreviewsByResourceId } from "@/cms/queries/courses.queries";
import { getPostPreviewsByTagId } from "@/cms/queries/posts.queries";
import { getFullName } from "@/cms/utils/getFullName";
import { getLastUpdatedTimestamp } from "@/cms/utils/getLastUpdatedTimestamp";
import { isResourceHidden } from "@/cms/utils/isResourceHidden";
import { pickRandom } from "@/cms/utils/pickRandom";
import { Icon } from "@/common/Icon";
import { PageContent } from "@/common/PageContent";
import { getLocale } from "@/i18n/getLocale";
import { type Dictionary, loadDictionary } from "@/i18n/loadDictionary";
import { useI18n } from "@/i18n/useI18n";
import { DublinCore as DublinCoreMetadata } from "@/metadata/DublinCore";
import { Highwire as HighwireMetadata } from "@/metadata/Highwire";
import { Metadata } from "@/metadata/Metadata";
import { useAlternateUrls } from "@/metadata/useAlternateUrls";
import { useCanonicalUrl } from "@/metadata/useCanonicalUrl";
import { useSiteMetadata } from "@/metadata/useSiteMetadata";
import { routes } from "@/navigation/routes.config";
import EventPage from "@/pages/event/[id].page";
import { createUrl } from "@/utils/createUrl";
import { type IsoDateString } from "@/utils/ts/aliases";
import { AuthorsAside } from "@/views/post/AuthorsAside";
import { Citation } from "@/views/post/Citation";
import { ContentTypeIcon } from "@/views/post/ContentTypeIcon";
import { FloatingTableOfContents } from "@/views/post/FloatingTableOfContents";
import { type CourseListItem, getCourseListData } from "@/views/post/getCourseListData";
import { getResourceListData, type ResourceListItem } from "@/views/post/getResourceListData";
import { Resource } from "@/views/post/Resource";
import { ReUseConditions } from "@/views/post/ReUseConditions";
import { TableOfContents } from "@/views/post/TableOfContents";
import { TagsAside } from "@/views/post/TagsAside";

const RELATED_RESOURCES_COUNT = 4;

export interface ResourcePageParams extends ParsedUrlQuery {
	kind: ResourceKind;
	id: string;
}

export interface ResourcePageProps {
	dictionary: Dictionary;
	resource: ResourceData;
	related: Array<ResourceListItem>;
	courses: Array<CourseListItem>;
	lastUpdatedAt: IsoDateString | null;
}

/**
 * Creates page for every resource.
 */
export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<ResourcePageParams>> {
	const { locales } = getLocale(context);

	const paths = (
		await Promise.all(
			locales.map(async (locale) => {
				const postIds = await getPostIds(locale);
				const eventIds = await getEventIds(locale);

				const posts = postIds.map((id) => {
					return {
						params: { kind: "posts" as const, id },
						locale,
					};
				});
				const events = eventIds.map((id) => {
					return {
						params: { kind: "events" as const, id },
						locale,
					};
				});

				return [...posts, ...events];
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
	context: GetStaticPropsContext<ResourcePageParams>,
): Promise<GetStaticPropsResult<ResourcePageProps>> {
	const { locale } = getLocale(context);

	const dictionary = await loadDictionary(locale, ["common"]);

	const { id, kind } = context.params as ResourcePageParams;

	if (kind === "events") {
		const resource = await getEventById(id, locale);
		return {
			props: {
				dictionary,
				resource,
				related: [],
				courses: [],
				lastUpdatedAt: null,
			},
		};
	}

	const resource = await getPostById(id, locale);

	if (isResourceHidden(resource.data.metadata.draft)) {
		return { notFound: true };
	}

	const resourcesWithSharedTags = (
		await Promise.all(
			resource.data.metadata.tags.map((tag) => {
				return getPostPreviewsByTagId(tag.id, locale);
			}),
		)
	)
		.flat()
		.filter((resource) => {
			return resource.id !== id;
		});
	const related = getResourceListData(pickRandom(resourcesWithSharedTags, RELATED_RESOURCES_COUNT));

	const courses = getCourseListData(await getCoursePreviewsByResourceId(id, locale));

	const lastUpdatedAt = await getLastUpdatedTimestamp(getPostFilePath(id, locale));

	return {
		props: {
			dictionary,
			resource,
			related,
			courses,
			lastUpdatedAt,
		},
	};
}

/**
 * Resource page.
 */
export default function ResourcePage(props: ResourcePageProps): JSX.Element {
	const { resource, related, courses, lastUpdatedAt } = props;

	const { t } = useI18n();
	const canonicalUrl = useCanonicalUrl();
	const languageAlternates = useAlternateUrls();
	const siteMetadata = useSiteMetadata();

	if (resource.kind === "events") {
		/** FIXME: we currently render event page both at `/events/:id` and `/resource/events/:id`. */
		return <EventPage dictionary={{}} resource={resource} />;
	}

	const { metadata, toc } = resource.data;

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
					/**
					 * The best option would probably be `LearningResource`, which
					 * unfortunately does not currently seem to be recognized by Google.
					 *
					 * @see https://developers.google.com/search/docs/advanced/structured-data/search-gallery
					 */
					"@type": "Course",
					url: canonicalUrl,
					headline: metadata.title,
					name: metadata.title,
					datePublished: metadata.date,
					abstract: metadata.abstract,
					description: metadata.abstract,
					inLanguage: metadata.lang,
					author: metadata.authors.map((author) => {
						return {
							"@type": "Person",
							familyName: author.lastName,
							givenName: author.firstName,
						};
					}),
					editor: metadata.editors?.map((editor) => {
						return {
							"@type": "Person",
							familyName: editor.lastName,
							givenName: editor.firstName,
						};
					}),
					contributor: metadata.contributors?.map((contributor) => {
						return {
							"@type": "Person",
							familyName: contributor.lastName,
							givenName: contributor.firstName,
						};
					}),
					version: metadata.version,
					license: metadata.licence.url,
					image:
						typeof metadata.featuredImage === "string"
							? metadata.featuredImage
							: metadata.featuredImage?.src,
					keywords: metadata.tags.map((tag) => {
						return tag.name;
					}),
					...(metadata.remote != null && metadata.remote.publisher != null
						? {
								provider: {
									"@type": "Organization",
									name: metadata.remote.publisher,
								},
						  }
						: {}),
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
			<PageContent className="grid w-full max-w-screen-lg px-4 py-8 mx-auto space-y-10 xs:py-16 xs:px-8 2xl:space-y-0 2xl:grid-cols-content-layout 2xl:gap-x-10 2xl:max-w-none">
				<aside
					className="sticky hidden w-full max-w-xs max-h-screen px-8 py-8 space-y-8 overflow-y-auto text-sm top-24 text-neutral-500 2xl:flex 2xl:flex-col justify-self-end"
					style={{
						maxHeight: "calc(100vh - 12px - var(--page-header-height))",
					}}
				>
					<AuthorsAside authors={metadata.authors} />
					<TagsAside tags={metadata.tags} />
					<CourseLinks courses={courses} />
					<Citation metadata={metadata} />
					<ReUseConditions />
				</aside>
				<div className="min-w-0">
					<Resource resource={resource} lastUpdatedAt={lastUpdatedAt} />
					<div className="flex flex-col w-full pt-12 mx-auto mt-12 space-y-12 text-sm border-t text-neutral-500 border-neutral-200 max-w-80ch 2xl:hidden">
						<Citation metadata={metadata} />
						<ReUseConditions />
					</div>
					<FullMetadata metadata={metadata} />
					<RelatedResources resources={related} />
				</div>
				{metadata.toc === true && toc.length > 0 ? (
					<Fragment>
						<aside
							className="sticky hidden w-full max-w-xs max-h-screen px-8 py-8 overflow-y-auto text-sm top-24 text-neutral-500 2xl:flex 2xl:flex-col"
							style={{
								maxHeight: "calc(100vh - 12px - var(--page-header-height))",
							}}
						>
							<TableOfContents
								toc={toc}
								aria-labelledby="table-of-contents"
								title={
									<h2
										id="table-of-contents"
										className="text-xs font-bold tracking-wide uppercase text-neutral-600"
									>
										{t("common.tableOfContents")}
									</h2>
								}
								className="w-full space-y-2"
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

interface CourseLinksProps {
	courses: Array<CourseListItem>;
}

/**
 * List of courses the resource is part of.
 */
function CourseLinks(props: CourseLinksProps) {
	const { courses } = props;

	const { t, pluralize } = useI18n();

	if (courses.length === 0) return null;

	const label = t("common.containedIn", {
		location: pluralize("common.thisCurriculum", courses.length),
	});

	return (
		<nav aria-label={label} className="w-full space-y-2">
			<h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">{label}</h2>
			<ul className="space-y-2">
				{courses.map((course) => {
					return (
						<li key={course.id}>
							<Link
								href={routes.course({ id: course.id })}
								className="flex items-center text-sm space-x-1.5 transition hover:text-primary-600 relative focus:outline-none rounded focus-visible:ring focus-visible:ring-primary-600"
							>
								<Icon icon={AcademicCapIcon} className="flex-shrink-0 w-4 h-4" />
								<span>{course.title}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

interface FullMetadataProps {
	metadata: PostData["data"]["metadata"];
}

/**
 * Full resource metadata.
 */
function FullMetadata(props: FullMetadataProps) {
	const { metadata } = props;

	const { t, formatDate } = useI18n();

	return (
		<div className="w-full py-12 mx-auto mt-12 space-y-3 border-t border-neutral-200 max-w-80ch">
			<h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
				{t("common.fullMetadata")}
			</h2>
			<dl className="flex flex-col space-y-1.5 text-sm text-neutral-500">
				<div className="flex space-x-1.5">
					<dt>{t("common.title")}:</dt>
					<dd>{metadata.title}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("common.authors")}:</dt>
					<dd>{metadata.authors.map(getFullName).join(", ")}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("common.domain")}:</dt>
					<dd>{metadata.domain}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("common.lang")}:</dt>
					<dd>{metadata.lang}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("common.published")}:</dt>
					<dd>{formatDate(new Date(metadata.date))}</dd>
				</div>
				{metadata.remote?.date ? (
					<div className="flex space-x-1.5">
						<dt>{t("common.remotePublished")}:</dt>
						<dd>{formatDate(new Date(metadata.remote.date))}</dd>
					</div>
				) : null}
				<div className="flex space-x-1.5">
					<dt>{t("common.contentType")}:</dt>
					<dd>{metadata.type.name}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("common.licence")}:</dt>
					<dd>{metadata.licence.name}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("common.categories")}:</dt>
					<dd>
						{metadata.categories
							.map((c) => {
								return c.name;
							})
							.join(", ")}
					</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("common.tags")}:</dt>
					<dd>
						{metadata.tags
							.map((t) => {
								return t.name;
							})
							.join(", ")}
					</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("common.version")}:</dt>
					<dd>{metadata.version}</dd>
				</div>
			</dl>
		</div>
	);
}

interface RelatedResourcesProps {
	resources: Array<ResourceListItem>;
}

/**
 * List of related resources.
 */
function RelatedResources(props: RelatedResourcesProps) {
	const { resources } = props;

	const { t } = useI18n();

	if (resources.length === 0) return null;

	return (
		<nav
			aria-label={t("common.relatedResources")}
			className="w-full py-12 mx-auto mb-12 space-y-3 border-t border-neutral-200 max-w-80ch"
		>
			<h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
				{t("common.relatedResources")}
			</h2>
			<ul className="flex flex-col space-y-1.5 text-sm text-neutral-500">
				{props.resources.map((resource) => {
					return (
						<li key={resource.id}>
							<Link
								href={routes.resource({ kind: resource.kind, id: resource.id })}
								className="flex items-center space-x-1.5 transition hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
							>
								<ContentTypeIcon
									type={resource.type.id}
									className="flex-shrink-0 w-3 h-3 text-primary-600"
								/>
								<span>{resource.title}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
