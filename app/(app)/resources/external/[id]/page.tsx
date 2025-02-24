import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";

import { createResourceUrl } from "@/app/(app)/resources/_lib/create-resource-url";
import { Citation } from "@/components/citation";
import { CurriculaList } from "@/components/curricula-list";
import { FloatingTableOfContents } from "@/components/floating-table-of-contents";
import { MainContent } from "@/components/main-content";
import { PeopleList } from "@/components/people-list";
import { ReUseConditions } from "@/components/re-use-conditions";
import { RelatedResourcesList } from "@/components/related-resources-list";
import { Resource } from "@/components/resource";
import { ResourceMetadata } from "@/components/resource-metadata";
import { TableOfContents } from "@/components/table-of-contents";
import { TagsList } from "@/components/tags-list";
import { TranslationsList } from "@/components/translations-list";
import { createClient } from "@/lib/content/create-client";
import { createResourceMetadata } from "@/lib/content/create-resource-metadata";
import { createFullUrl } from "@/lib/create-full-url";
import { getMetadata } from "@/lib/i18n/get-metadata";
import { pickRandom } from "@/lib/pick-random";

interface ExternalResourcePageProps {
	params: Promise<{
		id: string;
	}>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<ExternalResourcePageProps["params"]>, "id">>
> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const ids = await client.resources.external.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: Readonly<ExternalResourcePageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const locale = await getLocale();
	const meta = await getMetadata();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient(locale);
	const resource = await client.resources.external.get(id);
	const {
		authors,
		license,
		"publication-date": publicationDate,
		locale: contentLocale,
		summary,
		tags,
		title,
	} = resource.data;

	// FIXME: don't overwrite parent metadata
	const metadata: Metadata = {
		title,
		description: summary.content,
		...createResourceMetadata({
			authors: authors.map((author) => {
				return author.data.name;
			}),
			license: license.label,
			locale: contentLocale,
			publicationDate: publicationDate.toISOString(),
			siteTitle: meta.title,
			summary: summary.content,
			tags: tags.map((tag) => {
				return tag.data.name;
			}),
			title,
			url: String(createFullUrl({ pathname: createResourceUrl(resource) })),
		}),
	};

	return metadata;
}

export default async function ExternalResourcePage(
	props: Readonly<ExternalResourcePageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const locale = await getLocale();
	const t = await getTranslations("ExternalResourcePage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient(locale);
	const resource = await client.resources.external.get(id);
	const {
		authors,
		content,
		contributors,
		doi,
		editors,
		"featured-image": featuredImage,
		license,
		locale: contentLocale,
		"publication-date": publicationDate,
		remote,
		sources,
		tags,
		title,
		translations: _translations,
		version,
	} = resource.data;
	const { default: Content, tableOfContents } = await resource.compile(content);
	const related = pickRandom(Array.from(resource.related), 4);

	const translations = await Promise.all(
		_translations.map(async (id) => {
			const resource = await client.resources.get(id);
			return {
				id,
				collection: resource.collection,
				title: resource.data.title,
				locale: resource.data.locale,
			};
		}),
	);

	return (
		<MainContent>
			<div className="mx-auto grid w-full max-w-screen-lg gap-y-10 px-4 py-8 xs:px-8 xs:py-16 2xl:max-w-none 2xl:grid-cols-content-layout 2xl:gap-x-10 2xl:gap-y-0">
				<aside
					className="sticky top-24 hidden max-h-screen w-full max-w-xs gap-y-8 justify-self-end overflow-y-auto p-8 text-sm text-neutral-500 2xl:flex 2xl:flex-col"
					style={{ maxHeight: "calc(100dvh - 12px - var(--page-header-height))" }}
				>
					<PeopleList
						label={t("authors")}
						people={authors.map((person) => {
							return { id: person.id, image: person.data.image, name: person.data.name };
						})}
					/>
					<PeopleList
						label={t("contributors")}
						people={contributors.map((person) => {
							return { id: person.id, image: person.data.image, name: person.data.name };
						})}
					/>
					<PeopleList
						label={t("editors")}
						people={editors.map((person) => {
							return { id: person.id, image: person.data.image, name: person.data.name };
						})}
					/>
					<TagsList
						label={t("tags")}
						tags={tags.map((tag) => {
							return { id: tag.id, name: tag.data.name };
						})}
					/>
					<TranslationsList label={t("translations")} translations={translations} />
					<CurriculaList
						curricula={resource.curricula.map((curriculum) => {
							return { id: curriculum.id, title: curriculum.data.title };
						})}
						label={t("contained-in-curricula", { count: resource.curricula.length })}
					/>
					<Citation
						authors={authors.map((person) => {
							return { id: person.id, name: person.data.name };
						})}
						contentType={resource.data["content-type"].value}
						contributors={contributors.map((person) => {
							return { id: person.id, name: person.data.name };
						})}
						editors={editors.map((person) => {
							return { id: person.id, name: person.data.name };
						})}
						publicationDate={remote["publication-date"]}
						publisher={remote.publisher}
						title={title}
						url={remote.url}
						version={version}
					/>
					<ReUseConditions />
				</aside>

				<div className="min-w-0">
					<Resource
						authors={authors.map((person) => {
							return { id: person.id, image: person.data.image, name: person.data.name };
						})}
						collection={resource.collection}
						featuredImage={featuredImage}
						id={resource.id}
						// FIXME:
						// lastUpdatedAt={lastUpdatedAt}
						tags={tags.map((tag) => {
							return { id: tag.id, name: tag.data.name };
						})}
						title={title}
						translations={translations}
					>
						<div className="prose">
							<Content />
						</div>
					</Resource>
					<div className="mx-auto mt-12 flex w-full max-w-content flex-col gap-y-12 border-t border-neutral-200 pt-12 text-sm text-neutral-500 2xl:hidden">
						<Citation
							authors={authors.map((person) => {
								return { id: person.id, name: person.data.name };
							})}
							contentType={resource.data["content-type"].value}
							contributors={contributors.map((person) => {
								return { id: person.id, name: person.data.name };
							})}
							editors={editors.map((person) => {
								return { id: person.id, name: person.data.name };
							})}
							publicationDate={remote["publication-date"]}
							publisher={remote.publisher}
							title={title}
							url={remote.url}
							version={version}
						/>
						<ReUseConditions />
					</div>
					<ResourceMetadata
						authors={authors.map((person) => {
							return { id: person.id, name: person.data.name };
						})}
						contentType={resource.data["content-type"].value}
						license={license}
						locale={contentLocale}
						publicationDate={publicationDate}
						remotePublicationDate={remote["publication-date"]}
						sources={sources.map((source) => {
							return { id: source.id, name: source.data.name };
						})}
						tags={tags.map((tag) => {
							return { id: tag.id, name: tag.data.name };
						})}
						title={title}
						version={version}
					/>
					<RelatedResourcesList
						resources={related.map((resource) => {
							const contentType =
								resource.collection === "resources-events"
									? "event"
									: resource.collection === "resources-pathfinders"
										? "pathfinder"
										: resource.data["content-type"];

							return {
								collection: resource.collection,
								contentType,
								id: resource.id,
								title,
							};
						})}
					/>
				</div>

				{resource.data["table-of-contents"] && tableOfContents.length > 0 ? (
					<Fragment>
						<aside
							className="sticky top-24 hidden max-h-screen w-full max-w-xs overflow-y-auto p-8 text-sm text-neutral-500 2xl:flex 2xl:flex-col"
							style={{
								maxHeight: "calc(100dvh - 12px - var(--page-header-height))",
							}}
						>
							<TableOfContents
								aria-labelledby="table-of-contents"
								className="w-full space-y-2"
								tableOfContents={tableOfContents}
								title={
									<h2
										className="text-xs font-bold uppercase tracking-wide text-neutral-600"
										id="table-of-contents"
									>
										{t("table-of-contents")}
									</h2>
								}
							/>
						</aside>
						<aside className="2xl:hidden">
							<FloatingTableOfContents
								closeLabel={t("close")}
								label={t("table-of-contents")}
								tableOfContents={tableOfContents}
								toggleLabel={t("toggle-table-of-contents")}
							/>
						</aside>
					</Fragment>
				) : null}
			</div>
		</MainContent>
	);
}
