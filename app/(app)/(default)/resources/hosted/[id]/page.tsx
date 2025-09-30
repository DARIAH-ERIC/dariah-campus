import { assert } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";

import { Citation } from "@/components/citation";
import { CurriculaList } from "@/components/curricula-list";
import { FloatingTableOfContents } from "@/components/floating-table-of-contents";
import { PeopleList } from "@/components/people-list";
import { ReUseConditions } from "@/components/re-use-conditions";
import { RelatedResourcesList } from "@/components/related-resources-list";
import { Resource } from "@/components/resource";
import { ResourceMetadata } from "@/components/resource-metadata";
import { TableOfContents } from "@/components/table-of-contents";
import { TagsList } from "@/components/tags-list";
import { TranslationsList } from "@/components/translations-list";
import { env } from "@/config/env.config";
import { client } from "@/lib/content/client";
import { createGitHubClient } from "@/lib/content/github-client";
import { getPreviewMode } from "@/lib/content/github-client/get-preview-mode";
import { createResourceMetadata } from "@/lib/content/utils/create-resource-metadata";
import { getMetadata } from "@/lib/i18n/metadata";
import { createFullUrl } from "@/lib/navigation/create-full-url";
import { pickRandom } from "@/lib/utils/pick-random";

interface HostedResourcePageProps extends PageProps<"/resources/hosted/[id]"> {}

export function generateStaticParams(): Array<
	Pick<Awaited<HostedResourcePageProps["params"]>, "id">
> {
	const ids = client.collections.resourcesHosted.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: Readonly<HostedResourcePageProps>,
): Promise<Metadata> {
	const { params } = props;

	const meta = await getMetadata();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const preview = await getPreviewMode();

	const resource =
		preview.status === "enabled"
			? await createGitHubClient(preview).collections.resourcesHosted.get(id)
			: client.collections.resourcesHosted.get(id);

	if (resource == null) {
		notFound();
	}

	const {
		authors,
		license,
		locale: contentLocale,
		"publication-date": publicationDate,
		summary,
		tags,
		title,
	} = resource.metadata;

	// FIXME: don't overwrite parent metadata
	const metadata: Metadata = {
		title,
		description: summary.content,
		...createResourceMetadata({
			authors: authors.map((id) => {
				const person = client.collections.people.get(id);
				assert(person, `Missing person "${id}".`);
				const { name } = person.metadata;
				return name;
			}),
			license: client.collections.contentLicenses.get(license)?.label ?? "Unknown",
			locale: contentLocale,
			publicationDate: new Date(publicationDate).toISOString(),
			siteTitle: meta.title,
			summary: summary.content,
			tags: tags.map((id) => {
				const tag = client.collections.tags.get(id);
				assert(tag, `Missing tag "${id}".`);
				const { name } = tag.metadata;
				return name;
			}),
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

export default async function HostedResourcePage(
	props: Readonly<HostedResourcePageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const t = await getTranslations("HostedResourcePage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const preview = await getPreviewMode();

	const resource =
		preview.status === "enabled"
			? await createGitHubClient(preview).collections.resourcesHosted.get(id)
			: client.collections.resourcesHosted.get(id);

	if (resource == null) {
		notFound();
	}

	const {
		authors,
		contributors,
		doi,
		editors,
		"featured-image": featuredImage,
		license,
		locale: contentLocale,
		"publication-date": publicationDate,
		sources,
		tags,
		title,
		translations: _translations,
		version,
	} = resource.metadata;
	const Content = resource.content;
	const tableOfContents = resource.tableOfContents;
	const related = pickRandom(Array.from(resource.related), 4);

	const translations = _translations.map((id) => {
		const resource = client.collections.resources.get(id);
		assert(resource, `Missing resource "${id}".`);
		return {
			id,
			href: resource.href,
			title: resource.metadata.title,
			locale: resource.metadata.locale,
		};
	});

	return (
		<div>
			<div className="mx-auto grid w-full max-w-screen-lg gap-y-10 px-4 py-8 xs:px-8 xs:py-16 2xl:max-w-none 2xl:grid-cols-(--content-layout) 2xl:gap-x-10 2xl:gap-y-0">
				<aside
					className="sticky top-24 hidden max-h-screen w-full max-w-xs gap-y-8 justify-self-end overflow-y-auto p-8 text-sm text-neutral-500 2xl:flex 2xl:flex-col"
					style={{ maxHeight: "calc(100dvh - 12px - var(--page-header-height))" }}
				>
					<PeopleList
						label={t("authors")}
						people={authors.map((id) => {
							const person = client.collections.people.get(id);
							assert(person, `Missing person "${id}".`);
							const { image, name } = person.metadata;
							return { id, image, name };
						})}
					/>
					<PeopleList
						label={t("contributors")}
						people={contributors.map((id) => {
							const person = client.collections.people.get(id);
							assert(person, `Missing person "${id}".`);
							const { image, name } = person.metadata;
							return { id, image, name };
						})}
					/>
					<PeopleList
						label={t("editors")}
						people={editors.map((id) => {
							const person = client.collections.people.get(id);
							assert(person, `Missing person "${id}".`);
							const { image, name } = person.metadata;
							return { id, image, name };
						})}
					/>
					<TagsList
						label={t("tags")}
						tags={tags.map((id) => {
							const tag = client.collections.tags.get(id);
							assert(tag, `Missing tag "${id}".`);
							const { name } = tag.metadata;
							return { id, name };
						})}
					/>
					<TranslationsList label={t("translations")} translations={translations} />
					<CurriculaList
						curricula={resource.curricula.map((id) => {
							const curriculum = client.collections.curricula.get(id);
							assert(curriculum, `Missing curriculum "${id}".`);
							const { title } = curriculum.metadata;
							return { id, title, href: curriculum.href };
						})}
						label={t("contained-in-curricula", { count: resource.curricula.length })}
					/>
					<Citation
						authors={authors.map((id) => {
							const person = client.collections.people.get(id);
							assert(person, `Missing person "${id}".`);
							const { image, name } = person.metadata;
							return { id, image, name };
						})}
						contentType={resource.metadata["content-type"]}
						contributors={contributors.map((id) => {
							const person = client.collections.people.get(id);
							assert(person, `Missing person "${id}".`);
							const { image, name } = person.metadata;
							return { id, image, name };
						})}
						editors={editors.map((id) => {
							const person = client.collections.people.get(id);
							assert(person, `Missing person "${id}".`);
							const { image, name } = person.metadata;
							return { id, image, name };
						})}
						publicationDate={new Date(publicationDate)}
						title={title}
						url={
							doi ||
							String(
								createFullUrl({
									baseUrl: env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL,
									pathname: resource.href,
								}),
							)
						}
						version={version}
					/>
					<ReUseConditions />
				</aside>

				<div className="min-w-0">
					<Resource
						authors={authors.map((id) => {
							const person = client.collections.people.get(id);
							assert(person, `Missing person "${id}".`);
							const { image, name } = person.metadata;
							return { id, image, name };
						})}
						collection={`resources-${resource.kind}`}
						featuredImage={featuredImage}
						href={resource.href}
						id={resource.id}
						tags={tags.map((id) => {
							const tag = client.collections.tags.get(id);
							assert(tag, `Missing tag "${id}".`);
							const { name } = tag.metadata;
							return { id, name };
						})}
						title={title}
						translations={translations}
					>
						<div className="prose">
							<Content />
						</div>
					</Resource>
					<div className="mx-auto mt-12 flex w-full max-w-(--size-content) flex-col gap-y-12 border-t border-neutral-200 pt-12 text-sm text-neutral-500 2xl:hidden">
						<Citation
							authors={authors.map((id) => {
								const person = client.collections.people.get(id);
								assert(person, `Missing person "${id}".`);
								const { image, name } = person.metadata;
								return { id, image, name };
							})}
							contentType={resource.metadata["content-type"]}
							contributors={contributors.map((id) => {
								const person = client.collections.people.get(id);
								assert(person, `Missing person "${id}".`);
								const { image, name } = person.metadata;
								return { id, image, name };
							})}
							editors={editors.map((id) => {
								const person = client.collections.people.get(id);
								assert(person, `Missing person "${id}".`);
								const { image, name } = person.metadata;
								return { id, image, name };
							})}
							publicationDate={new Date(publicationDate)}
							title={title}
							url={
								doi ||
								String(
									createFullUrl({
										baseUrl: env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL,
										pathname: resource.href,
									}),
								)
							}
							version={version}
						/>
						<ReUseConditions />
					</div>
					<ResourceMetadata
						authors={authors.map((id) => {
							const person = client.collections.people.get(id);
							assert(person, `Missing person "${id}".`);
							const { image, name } = person.metadata;
							return { id, image, name };
						})}
						contentType={resource.metadata["content-type"]}
						doi={doi}
						license={client.collections.contentLicenses.get(license) ?? { label: "Unknown" }}
						locale={contentLocale}
						publicationDate={new Date(publicationDate)}
						sources={sources.map((id) => {
							const source = client.collections.sources.get(id);
							assert(source, `Missing source "${id}".`);
							const { name } = source.metadata;
							return { id, name };
						})}
						tags={tags.map((id) => {
							const tag = client.collections.tags.get(id);
							assert(tag, `Missing tag "${id}".`);
							const { name } = tag.metadata;
							return { id, name };
						})}
						title={title}
						version={version}
					/>
					<RelatedResourcesList
						resources={related.map((id) => {
							const resource = client.collections.resources.get(id);
							assert(resource, `Missing resource "${id}".`);

							return {
								href: resource.href,
								contentType: resource.metadata["content-type"],
								id: resource.id,
								title: resource.metadata.title,
							};
						})}
					/>
				</div>

				{resource.metadata["table-of-contents"] &&
				tableOfContents != null &&
				tableOfContents.length > 0 ? (
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
										className="text-xs font-bold tracking-wide text-neutral-600 uppercase"
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
		</div>
	);
}
