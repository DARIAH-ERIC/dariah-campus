import { createUrl, keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";
import { jsonLdScriptProps } from "react-schemaorg";

import { createResourceUrl } from "@/app/(app)/resources/_lib/create-resource-url";
import { AttachmentsList } from "@/components/attachments-list";
import { Citation } from "@/components/citation";
import { CurriculaList } from "@/components/curricula-list";
import { FloatingTableOfContents } from "@/components/floating-table-of-contents";
import { LinksList } from "@/components/links-list";
import { MainContent } from "@/components/main-content";
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
import { createClient } from "@/lib/content/create-client";
import { createResourceMetadata } from "@/lib/content/create-resource-metadata";
import { createFullUrl } from "@/lib/create-full-url";
import { getMetadata } from "@/lib/i18n/get-metadata";
import { pickRandom } from "@/lib/pick-random";

interface EventResourcePageProps {
	params: Promise<{
		id: string;
	}>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<EventResourcePageProps["params"]>, "id">>
> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const ids = await client.resources.events.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: Readonly<EventResourcePageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const locale = await getLocale();
	const meta = await getMetadata();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient(locale);
	const resource = await client.resources.events.get(id);
	const {
		authors,
		license,
		"publication-date": publicationDate,
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
			locale: locale,
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

export default async function EventResourcePage(
	props: Readonly<EventResourcePageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const locale = await getLocale();
	const t = await getTranslations("EventResourcePage");
	const format = await getFormatter();
	const meta = await getMetadata();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient(locale);
	const resource = await client.resources.events.get(id);
	const {
		authors,
		content,
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
		//
		sessions,
		attachments,
		links,
		social,
		"end-date": endDate,
		"start-date": startDate,
		location,
		organisations,
	} = resource.data;
	const { default: Content } = await resource.compile(content);
	const related = pickRandom(Array.from(resource.related), 4);
	const tableOfContents = sessions.map((session, index) => {
		return {
			value: session.title,
			depth: 0,
			id: `session-${String(index + 1)}`,
		};
	});

	const people = await client.people.all();
	const peopleById = keyByToMap(people, (person) => {
		return person.id;
	});

	return (
		<MainContent>
			{/* @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld */}
			<script
				{...jsonLdScriptProps({
					"@context": "https://schema.org",
					"@type": "LearningResource",
					url: String(createFullUrl({ pathname: createResourceUrl(resource) })),
					headline: title,
					name: title,
					datePublished: publicationDate.toISOString(),
					abstract: summary.content,
					description: summary.content,
					inLanguage: contentLocale,
					author: authors.map((person) => {
						return {
							"@type": "Person" as const,
							name: person.data.name,
						};
					}),
					version,
					license: license.label,
					image: featuredImage ?? undefined,
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

			<div className="mx-auto grid w-full max-w-screen-lg space-y-10 px-4 py-8 xs:px-8 xs:py-16 2xl:max-w-none 2xl:grid-cols-content-layout 2xl:gap-x-10 2xl:space-y-0">
				<aside
					className="sticky top-24 hidden max-h-screen w-full max-w-xs space-y-8 justify-self-end overflow-y-auto p-8 text-sm text-neutral-500 2xl:flex 2xl:flex-col"
					style={{ maxHeight: "calc(100dvh - 12px - var(--page-header-height))" }}
				>
					<div className="flex flex-col gap-y-2 text-sm text-neutral-500">
						<div className="text-xs font-bold uppercase tracking-wide text-neutral-600">
							{t("location")}
						</div>
						<div>{location}</div>
					</div>
					<div className="flex flex-col gap-y-2 text-sm text-neutral-500">
						<div className="text-xs font-bold uppercase tracking-wide text-neutral-600">
							{t("date")}
						</div>
						<div>
							{endDate
								? format.dateTimeRange(startDate, endDate, { dateStyle: "long" })
								: format.dateTime(startDate, { dateStyle: "long" })}
						</div>
					</div>
					<PeopleList
						label={t("authors")}
						people={authors.map((person) => {
							return { id: person.id, image: person.data.image, name: person.data.name };
						})}
					/>
					<TagsList
						label={t("tags")}
						tags={tags.map((tag) => {
							return { id: tag.id, name: tag.data.name };
						})}
					/>
					<AttachmentsList attachments={attachments} label={t("attachments")} />
					<LinksList label={t("links")} links={links} />
					<SocialMediaList label={t("social-media")} social={social} />
					<OrganisationsList label={t("organized-by")} organisations={organisations} />
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
						publicationDate={publicationDate}
						title={title}
						url={String(createFullUrl({ pathname: createResourceUrl(resource) }))}
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
						endDate={endDate ?? undefined}
						featuredImage={featuredImage}
						id={resource.id}
						location={location}
						organisations={organisations}
						social={social}
						startDate={startDate}
						// FIXME:
						// lastUpdatedAt={lastUpdatedAt}
						tags={tags.map((tag) => {
							return { id: tag.id, name: tag.data.name };
						})}
						title={title}
					>
						<div className="prose">
							<Content />
						</div>

						<hr className="my-12 bg-neutral-200" />

						<ol className="list-none divide-y divide-neutral-200">
							{sessions.map(async (session, index) => {
								const { default: SessionContent } = await resource.compile(session.content);

								const speakers = await Promise.all(
									session.speakers.map(async (id) => {
										const person = peopleById.get(id)!;
										const { default: SpeakerDescription } = await resource.compile(
											person.data.content,
										);
										return {
											id,
											...person.data,
											SpeakerDescription,
										};
									}),
								);

								return (
									<li key={index} id={`session-${String(index + 1)}`}>
										<Session
											attachments={session.attachments}
											// eslint-disable-next-line @typescript-eslint/unbound-method
											compile={resource.compile}
											index={index + 1}
											links={session.links}
											peopleById={peopleById}
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
					<div className="mx-auto mt-12 flex w-full max-w-80ch flex-col space-y-12 border-t border-neutral-200 pt-12 text-sm text-neutral-500 2xl:hidden">
						<Citation
							authors={authors.map((person) => {
								return { id: person.id, name: person.data.name };
							})}
							contentType={resource.data["content-type"].value}
							publicationDate={publicationDate}
							title={title}
							url={String(createFullUrl({ pathname: createResourceUrl(resource) }))}
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
						locale={locale}
						publicationDate={publicationDate}
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
								title: title,
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
