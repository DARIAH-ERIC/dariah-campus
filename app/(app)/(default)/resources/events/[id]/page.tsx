import { assert, createUrl } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";
import { jsonLdScriptProps } from "react-schemaorg";

import { AttachmentsList } from "@/components/attachments-list";
import { Citation } from "@/components/citation";
import { CurriculaList } from "@/components/curricula-list";
import { FloatingTableOfContents } from "@/components/floating-table-of-contents";
import { LinksList } from "@/components/links-list";
import { OrganisationsList } from "@/components/organisations-list";
import { PeopleList } from "@/components/people-list";
import { ReUseConditions } from "@/components/re-use-conditions";
import { RelatedResourcesList } from "@/components/related-resources-list";
import { Resource } from "@/components/resource";
import { ResourceMetadata } from "@/components/resource-metadata";
import { Session } from "@/components/session";
import { SocialMediaList } from "@/components/social-media-list";
import { TableOfContents } from "@/components/table-of-contents";
import { TagsList } from "@/components/tags-list";
import { TranslationsList } from "@/components/translations-list";
import { client } from "@/lib/content/client";
import { createGitHubClient } from "@/lib/content/github-client";
import { createResourceMetadata } from "@/lib/content/utils/create-resource-metadata";
import { getMetadata } from "@/lib/i18n/metadata";
import { createFullUrl } from "@/lib/navigation/create-full-url";
import { pickRandom } from "@/lib/utils/pick-random";

interface EventResourcePageProps extends PageProps<"/resources/events/[id]"> {}

export function generateStaticParams(): Array<
	Pick<Awaited<EventResourcePageProps["params"]>, "id">
> {
	const ids = client.collections.resourcesEvents.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(props: Readonly<EventResourcePageProps>): Promise<Metadata> {
	const { params } = props;

	const meta = await getMetadata();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const draft = await draftMode();

	const resource = draft.isEnabled
		? await (await createGitHubClient()).collections.resourcesEvents.get(id)
		: client.collections.resourcesEvents.get(id);

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
			url: String(createFullUrl({ pathname: resource.href })),
		}),
	};

	return metadata;
}

export default async function EventResourcePage(
	props: Readonly<EventResourcePageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const t = await getTranslations("EventResourcePage");
	const format = await getFormatter();
	const meta = await getMetadata();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const draft = await draftMode();

	const resource = draft.isEnabled
		? await (await createGitHubClient()).collections.resourcesEvents.get(id)
		: client.collections.resourcesEvents.get(id);

	if (resource == null) {
		notFound();
	}

	const {
		authors,
		doi,
		"featured-image": featuredImage,
		license,
		locale: contentLocale,
		"publication-date": publicationDate,
		sources,
		summary,
		tags,
		title,
		version,
		sessions,
		attachments,
		links,
		social,
		"end-date": endDate,
		"start-date": startDate,
		location,
		organisations,
		translations: _translations,
	} = resource.metadata;
	const Content = resource.content;
	const related = pickRandom(Array.from(resource.related), 4);
	const tableOfContents = sessions.map((session, index) => {
		return {
			value: session.title,
			depth: 0,
			id: `session-${String(index + 1)}`,
		};
	});

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
			{/* @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld */}
			<script
				{...jsonLdScriptProps({
					"@context": "https://schema.org",
					"@type": "LearningResource",
					url: String(createFullUrl({ pathname: resource.href })),
					headline: title,
					name: title,
					datePublished: new Date(publicationDate).toISOString(),
					abstract: summary.content,
					description: summary.content,
					inLanguage: contentLocale,
					author: authors.map((id) => {
						const person = client.collections.people.get(id);
						assert(person, `Missing person "${id}".`);
						return {
							"@type": "Person" as const,
							name: person.metadata.name,
						};
					}),
					version,
					license: client.collections.contentLicenses.get(license)?.label ?? "Unknown",
					image:
						typeof featuredImage === "string" ? featuredImage : (featuredImage?.src ?? undefined),
					publisher: {
						"@type": "Organization",
						name: meta.title,
						description: meta.description,
						url: meta.social.website,
						logo: String(createFullUrl({ pathname: `/logo.svg` })),
						sameAs: String(
							createUrl({ baseUrl: "https://twitter.com", pathname: meta.social.twitter }),
						),
					},
				})}
			/>

			<div className="mx-auto grid w-full max-w-screen-lg gap-y-10 px-4 py-8 xs:px-8 xs:py-16 2xl:max-w-none 2xl:grid-cols-(--content-layout) 2xl:gap-x-10 2xl:gap-y-0">
				<aside
					className="sticky top-24 hidden max-h-screen w-full max-w-xs gap-y-8 justify-self-end overflow-y-auto p-8 text-sm text-neutral-500 2xl:flex 2xl:flex-col"
					style={{ maxHeight: "calc(100dvh - 12px - var(--page-header-height))" }}
				>
					<div className="flex flex-col gap-y-2 text-sm text-neutral-500">
						<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">
							{t("location")}
						</div>
						<div>{location}</div>
					</div>
					<div className="flex flex-col gap-y-2 text-sm text-neutral-500">
						<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">
							{t("date")}
						</div>
						<div>
							{endDate != null
								? format.dateTimeRange(new Date(startDate), new Date(endDate), {
										dateStyle: "long",
									})
								: format.dateTime(new Date(startDate), { dateStyle: "long" })}
						</div>
					</div>
					<PeopleList
						label={t("authors")}
						people={authors.map((id) => {
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
					<AttachmentsList attachments={attachments} label={t("attachments")} />
					<LinksList label={t("links")} links={links} />
					<SocialMediaList label={t("social-media")} social={social} />
					<OrganisationsList label={t("organized-by")} organisations={organisations} />
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
						publicationDate={new Date(publicationDate)}
						title={title}
						url={doi || String(createFullUrl({ pathname: resource.href }))}
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
						endDate={endDate != null ? new Date(endDate) : undefined}
						featuredImage={featuredImage}
						href={resource.href}
						id={resource.id}
						location={location}
						organisations={organisations}
						social={social}
						startDate={new Date(startDate)}
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

						<hr className="my-12 border-t border-neutral-200" />

						<ol className="list-none divide-y divide-neutral-200">
							{sessions.map((session, index) => {
								const SessionContent = session.content;

								const speakers = session.speakers.map((id) => {
									const person = client.collections.people.get(id)!;
									assert(person, `Missing person "${id}".`);
									const SpeakerDescription = person.content;
									return {
										id,
										...person.metadata,
										SpeakerDescription,
									};
								});

								return (
									<li key={index} id={`session-${String(index + 1)}`}>
										<Session
											attachments={session.attachments}
											index={index + 1}
											links={session.links}
											presentations={session.presentations}
											speakers={speakers}
											title={session.title}
										>
											<div className="prose">
												<SessionContent />
											</div>
										</Session>
									</li>
								);
							})}
						</ol>
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
							publicationDate={new Date(publicationDate)}
							title={title}
							url={doi || String(createFullUrl({ pathname: resource.href }))}
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

				{tableOfContents.length > 0 ? (
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
										key="table-of-contents"
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
