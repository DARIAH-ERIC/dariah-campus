import { assert } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { Citation } from "#/components/citation.tsx";
import { CurriculaList } from "#/components/curricula-list.tsx";
import { FloatingTableOfContents } from "#/components/floating-table-of-contents.tsx";
import { PeopleList } from "#/components/people-list.tsx";
import { ReUseConditions } from "#/components/re-use-conditions.tsx";
import { RelatedResourcesList } from "#/components/related-resources-list.tsx";
import { ResourceDetails } from "#/components/resource-details.tsx";
import { Resource } from "#/components/resource.tsx";
import { TableOfContents } from "#/components/table-of-contents.tsx";
import { TagsList } from "#/components/tags-list.tsx";
import { TranslationOf } from "#/components/translation-of.tsx";
import { TranslationsList } from "#/components/translations-list.tsx";
import { env } from "#/configs/env.config.ts";
import { client } from "#/lib/content/client/index.ts";
import { createClient } from "#/lib/content/create-client.ts";
import { createResourceMetadata } from "#/lib/content/utils/create-resource-metadata.ts";
import { getMetadata } from "#/lib/i18n/metadata.ts";
import { createFullUrl } from "#/lib/navigation/create-full-url.ts";
import { pickRandom } from "#/lib/utils/pick-random.ts";

interface ExternalResourcePageProps extends PageProps<"/resources/external/[id]"> {}

export async function generateStaticParams(): Promise<Array<Pick<Awaited<ExternalResourcePageProps["params"]>, "id">>> {
	const ids = await client.collections.resourcesExternal.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(props: Readonly<ExternalResourcePageProps>): Promise<Metadata> {
	const { params } = props;

	const meta = await getMetadata();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient();

	const resource = await client.collections.resourcesExternal.get(id);

	if (resource == null) {
		notFound();
	}

	const {
		authors,
		license,
		"publication-date": publicationDate,
		locale: contentLocale,
		summary,
		tags,
		title,
	} = resource.metadata;

	// FIXME: don't overwrite parent metadata
	const metadata: Metadata = {
		title,
		description: summary.content,
		...createResourceMetadata({
			authors: await Promise.all(
				authors.map(async (id) => {
					const person = await client.collections.people.get(id);
					assert(person, `Missing person "${id}".`);
					const { name } = person.metadata;
					return name;
				}),
			),
			license: (await client.collections.contentLicenses.get(license))?.label ?? "Unknown",
			locale: contentLocale,
			publicationDate: new Date(publicationDate).toISOString(),
			siteTitle: meta.title,
			summary: summary.content,
			tags: await Promise.all(
				tags.map(async (id) => {
					const tag = await client.collections.tags.get(id);
					assert(tag, `Missing tag "${id}".`);
					const { name } = tag.metadata;
					return name;
				}),
			),
			title,
			url: String(
				createFullUrl({
					baseUrl: env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL,
					pathname: resource.href,
				}),
			),
		}),
	};

	return metadata;
}

export default async function ExternalResourcePage(props: Readonly<ExternalResourcePageProps>): Promise<ReactNode> {
	const { params } = props;

	const t = await getTranslations("ExternalResourcePage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient();

	const resource = await client.collections.resourcesExternal.get(id);

	if (resource == null) {
		notFound();
	}

	const {
		authors,
		contributors,
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
		"is-translation-of": _isTranslationOf,
		version,
	} = resource.metadata;
	const Content = resource.content;
	const tableOfContents = resource.tableOfContents;
	const related = pickRandom(Array.from(resource.related), 4);

	async function getTranslationMetadata(id: string) {
		const resource = await client.collections.resources.get(id);
		assert(resource, `Missing resource "${id}".`);
		return {
			id,
			href: resource.href,
			title: resource.metadata.title,
			locale: resource.metadata.locale,
		};
	}

	const translations = await Promise.all(_translations.map((v) => getTranslationMetadata(v)));
	const isTranslationOf = _isTranslationOf != null ? await getTranslationMetadata(_isTranslationOf) : null;
	const [contentLicense, resourceSources] = await Promise.all([
		client.collections.contentLicenses.get(license),
		Promise.all(
			sources.map(async (id) => {
				const source = await client.collections.sources.get(id);
				assert(source, `Missing source "${id}".`);
				const { name } = source.metadata;
				return { id, name };
			}),
		),
	]);

	return (
		<div>
			<div className="mx-auto grid max-w-screen-lg gap-y-10 px-4 py-8 inline-full xs:px-8 xs:py-16 xl:grid-cols-(--content-layout) xl:gap-x-(--content-layout-gap) xl:gap-y-0 xl:max-inline-none">
				<aside
					className="sticky inset-bs-24 hidden gap-y-8 justify-self-end overflow-y-auto p-6 text-sm text-neutral-500 inline-full max-block-screen max-inline-(--size-sidebar) xl:flex xl:flex-col 2xl:p-8"
					style={{ maxHeight: "calc(100dvh - 12px - var(--page-header-height))" }}
				>
					<div className="flex flex-col gap-y-5">
						<PeopleList
							label={t("authors")}
							people={await Promise.all(
								authors.map(async (id) => {
									const person = await client.collections.people.get(id);
									assert(person, `Missing person "${id}".`);
									const { image, name } = person.metadata;
									return { id, image, name };
								}),
							)}
						/>
						<PeopleList
							label={t("contributors")}
							people={await Promise.all(
								contributors.map(async (id) => {
									const person = await client.collections.people.get(id);
									assert(person, `Missing person "${id}".`);
									const { image, name } = person.metadata;
									return { id, image, name };
								}),
							)}
						/>
						<PeopleList
							label={t("editors")}
							people={await Promise.all(
								editors.map(async (id) => {
									const person = await client.collections.people.get(id);
									assert(person, `Missing person "${id}".`);
									const { image, name } = person.metadata;
									return { id, image, name };
								}),
							)}
						/>
						<TagsList
							label={t("tags")}
							tags={await Promise.all(
								tags.map(async (id) => {
									const tag = await client.collections.tags.get(id);
									assert(tag, `Missing tag "${id}".`);
									const { name } = tag.metadata;
									return { id, name };
								}),
							)}
						/>
						<TranslationsList label={t("translations")} translations={translations} />
						<TranslationOf label={t("is-translation-of")} resource={isTranslationOf} />
						<CurriculaList
							curricula={await Promise.all(
								resource.curricula.map(async (id) => {
									const curriculum = await client.collections.curricula.get(id);
									assert(curriculum, `Missing curriculum "${id}".`);
									const { title } = curriculum.metadata;
									return { id, title, href: curriculum.href };
								}),
							)}
							label={t("contained-in-curricula", { count: resource.curricula.length })}
						/>
						<ResourceDetails
							license={contentLicense ?? { label: "Unknown" }}
							locale={contentLocale}
							originalPublicationDate={new Date(remote["publication-date"])}
							publicationDate={new Date(publicationDate)}
							sources={resourceSources}
						/>
					</div>
					<Citation
						authors={await Promise.all(
							authors.map(async (id) => {
								const person = await client.collections.people.get(id);
								assert(person, `Missing person "${id}".`);
								const { image, name } = person.metadata;
								return { id, image, name };
							}),
						)}
						contentType={resource.metadata["content-type"]}
						contributors={await Promise.all(
							contributors.map(async (id) => {
								const person = await client.collections.people.get(id);
								assert(person, `Missing person "${id}".`);
								const { image, name } = person.metadata;
								return { id, image, name };
							}),
						)}
						editors={await Promise.all(
							editors.map(async (id) => {
								const person = await client.collections.people.get(id);
								assert(person, `Missing person "${id}".`);
								const { image, name } = person.metadata;
								return { id, image, name };
							}),
						)}
						publicationDate={new Date(publicationDate)}
						publisher={remote.publisher}
						title={title}
						url={remote.url}
						version={version}
					/>
					<ReUseConditions />
				</aside>

				<div className="min-inline-0">
					<Resource
						authors={await Promise.all(
							authors.map(async (id) => {
								const person = await client.collections.people.get(id);
								assert(person, `Missing person "${id}".`);
								const { image, name } = person.metadata;
								return { id, image, name };
							}),
						)}
						collection={`resources-${resource.kind}`}
						featuredImage={featuredImage}
						href={resource.href}
						id={resource.id}
						isTranslationOf={isTranslationOf}
						tags={await Promise.all(
							tags.map(async (id) => {
								const tag = await client.collections.tags.get(id);
								assert(tag, `Missing tag "${id}".`);
								const { name } = tag.metadata;
								return { id, name };
							}),
						)}
						title={title}
						translations={translations}
					>
						<div className="prose">
							<Content />
						</div>
					</Resource>
					<div className="mx-auto mbs-12 flex flex-col gap-y-12 border-bs border-neutral-200 pbs-12 text-sm text-neutral-500 inline-full max-inline-(--size-content) xl:hidden">
						<ResourceDetails
							license={contentLicense ?? { label: "Unknown" }}
							locale={contentLocale}
							originalPublicationDate={new Date(remote["publication-date"])}
							publicationDate={new Date(publicationDate)}
							sources={resourceSources}
						/>
						<Citation
							authors={await Promise.all(
								authors.map(async (id) => {
									const person = await client.collections.people.get(id);
									assert(person, `Missing person "${id}".`);
									const { image, name } = person.metadata;
									return { id, image, name };
								}),
							)}
							contentType={resource.metadata["content-type"]}
							contributors={await Promise.all(
								contributors.map(async (id) => {
									const person = await client.collections.people.get(id);
									assert(person, `Missing person "${id}".`);
									const { image, name } = person.metadata;
									return { id, image, name };
								}),
							)}
							editors={await Promise.all(
								editors.map(async (id) => {
									const person = await client.collections.people.get(id);
									assert(person, `Missing person "${id}".`);
									const { image, name } = person.metadata;
									return { id, image, name };
								}),
							)}
							publicationDate={new Date(publicationDate)}
							publisher={remote.publisher}
							title={title}
							url={remote.url}
							version={version}
						/>
						<ReUseConditions />
					</div>
					<RelatedResourcesList
						resources={await Promise.all(
							related.map(async (id) => {
								const resource = await client.collections.resources.get(id);
								assert(resource, `Missing resource "${id}".`);

								return {
									href: resource.href,
									contentType: resource.metadata["content-type"],
									id: resource.id,
									title: resource.metadata.title,
								};
							}),
						)}
					/>
				</div>

				{resource.metadata["table-of-contents"] && tableOfContents != null && tableOfContents.length > 0 ? (
					<Fragment>
						<aside
							className="sticky inset-bs-24 hidden overflow-y-auto p-6 text-sm text-neutral-500 inline-full max-block-screen max-inline-(--size-sidebar) xl:flex xl:flex-col 2xl:p-8"
							style={{
								maxHeight: "calc(100dvh - 12px - var(--page-header-height))",
							}}
						>
							<TableOfContents
								aria-labelledby="table-of-contents"
								className="space-y-2 inline-full"
								tableOfContents={tableOfContents}
								title={
									<h2 className="text-xs font-bold tracking-wide text-neutral-600 uppercase" id="table-of-contents">
										{t("table-of-contents")}
									</h2>
								}
							/>
						</aside>
						<aside className="xl:hidden">
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
		</div>
	);
}
