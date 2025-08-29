import { assert } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Curriculum } from "@/components/curriculum";
import { CurriculumResourcesList } from "@/components/curriculum-resources-list";
import { PeopleList } from "@/components/people-list";
import { RelatedCurriculaList } from "@/components/related-curricula-list";
import { TagsList } from "@/components/tags-list";
import { TranslationsList } from "@/components/translations-list";
import { client } from "@/lib/content/client";
import { pickRandom } from "@/lib/utils/pick-random";

export const dynamicParams = false;

interface CurriculumPageProps extends PageProps<"/curricula/[id]"> {}

export function generateStaticParams(): Array<Pick<Awaited<CurriculumPageProps["params"]>, "id">> {
	const ids = client.collections.curricula.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(props: Readonly<CurriculumPageProps>): Promise<Metadata> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const draft = await draftMode();

	const curriculum = draft.isEnabled
		? await (
				await (await import("@/lib/content/github-client")).createGitHubClient()
			).collections.curricula.get(id)
		: client.collections.curricula.get(id);

	if (curriculum == null) {
		notFound();
	}

	const { summary, title } = curriculum.metadata;

	const metadata: Metadata = {
		title,
		description: summary.content,
	};

	return metadata;
}

export default async function CurriculumPage(
	props: Readonly<CurriculumPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const t = await getTranslations("CurriculumPage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const draft = await draftMode();

	const curriculum = draft.isEnabled
		? await (
				await (await import("@/lib/content/github-client")).createGitHubClient()
			).collections.curricula.get(id)
		: client.collections.curricula.get(id);

	if (curriculum == null) {
		notFound();
	}

	const {
		editors,
		"featured-image": featuredImage,
		resources,
		tags,
		title,
		translations: _translations,
	} = curriculum.metadata;

	const Content = curriculum.content;

	const related = pickRandom(Array.from(curriculum.related), 4);

	const translations = _translations.map((id) => {
		const curriculum = client.collections.curricula.get(id);
		assert(curriculum, `Missing curriculum "${id}".`);
		return {
			id,
			href: curriculum.href,
			title: curriculum.metadata.title,
			locale: curriculum.metadata.locale,
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

					<CurriculumResourcesList
						label={t("overview")}
						resources={resources.map(({ value: id }) => {
							const resource = client.collections.resources.get(id);
							assert(resource, `Missing resource "${id}".`);
							return {
								id,
								summary: resource.metadata.summary,
								title: resource.metadata.title,
							};
						})}
					/>
				</aside>

				<div className="min-w-0">
					<Curriculum
						editors={editors.map((id) => {
							const person = client.collections.people.get(id);
							assert(person, `Missing person "${id}".`);
							const { image, name } = person.metadata;
							return { id, image, name };
						})}
						featuredImage={featuredImage}
						resources={resources.map(({ value: id, discriminant: type }) => {
							const resource = client.collections.resources.get(id);
							assert(resource, `Missing resource "${id}".`);
							return {
								authors: resource.metadata.authors.map((id) => {
									const person = client.collections.people.get(id)!;
									assert(person, `Missing person "${id}".`);
									const { image, name } = person.metadata;
									return { id, image, name };
								}),
								kind: type,
								contentType: resource.metadata["content-type"],
								id: resource.id,
								href: resource.href,
								locale: resource.metadata.locale,
								summary: resource.metadata.summary,
								title: resource.metadata.title,
								draft: resource.metadata.draft,
							};
						})}
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
					</Curriculum>
					<RelatedCurriculaList
						curricula={related.map((id) => {
							const curriculum = client.collections.curricula.get(id);
							assert(curriculum, `Missing curriculum "${id}".`);
							return { id, title: curriculum.metadata.title, href: curriculum.href };
						})}
					/>
				</div>
			</div>
		</div>
	);
}
