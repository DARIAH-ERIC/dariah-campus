import { assert } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Curriculum } from "@/components/curriculum";
import { CurriculumResourcesList } from "@/components/curriculum-resources-list";
import { PeopleList } from "@/components/people-list";
import { RelatedCurriculaList } from "@/components/related-curricula-list";
import { TagsList } from "@/components/tags-list";
import { TranslationOf } from "@/components/translation-of";
import { TranslationsList } from "@/components/translations-list";
import { client } from "@/lib/content/client";
import { createGitHubClient } from "@/lib/content/github-client";
import { getPreviewMode } from "@/lib/content/github-client/get-preview-mode";
import { pickRandom } from "@/lib/utils/pick-random";

interface CurriculumPageProps extends PageProps<"/curricula/[id]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<CurriculumPageProps["params"]>, "id">>
> {
	const ids = await client.collections.curricula.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(props: Readonly<CurriculumPageProps>): Promise<Metadata> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const preview = await getPreviewMode();

	const curriculum =
		preview.status === "enabled"
			? await createGitHubClient(preview).collections.curricula.get(id)
			: await client.collections.curricula.get(id);

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

	const preview = await getPreviewMode();

	const curriculum =
		preview.status === "enabled"
			? await createGitHubClient(preview).collections.curricula.get(id)
			: await client.collections.curricula.get(id);

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
		"is-translation-of": _isTranslationOf,
	} = curriculum.metadata;

	const Content = curriculum.content;

	const related = pickRandom(Array.from(curriculum.related), 4);

	async function getTranslationMetadata(id: string) {
		const curriculum = await client.collections.curricula.get(id);
		assert(curriculum, `Missing curriculum "${id}".`);
		return {
			id,
			href: curriculum.href,
			title: curriculum.metadata.title,
			locale: curriculum.metadata.locale,
		};
	}

	const translations = await Promise.all(_translations.map(getTranslationMetadata));
	const isTranslationOf =
		_isTranslationOf != null ? await getTranslationMetadata(_isTranslationOf) : null;

	return (
		<div>
			<div className="mx-auto grid w-full max-w-screen-lg gap-y-10 px-4 py-8 xs:px-8 xs:py-16 2xl:max-w-none 2xl:grid-cols-(--content-layout) 2xl:gap-x-10 2xl:gap-y-0">
				<aside
					className="sticky top-24 hidden max-h-screen w-full max-w-xs gap-y-8 justify-self-end overflow-y-auto p-8 text-sm text-neutral-500 2xl:flex 2xl:flex-col"
					style={{ maxHeight: "calc(100dvh - 12px - var(--page-header-height))" }}
				>
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
					<CurriculumResourcesList
						label={t("overview")}
						resources={await Promise.all(
							resources.map(async ({ value: id }) => {
								const resource = await client.collections.resources.get(id);
								assert(resource, `Missing resource "${id}".`);
								return {
									id,
									summary: resource.metadata.summary,
									title: resource.metadata.title,
								};
							}),
						)}
					/>
				</aside>

				<div className="min-w-0">
					<Curriculum
						editors={await Promise.all(
							editors.map(async (id) => {
								const person = await client.collections.people.get(id);
								assert(person, `Missing person "${id}".`);
								const { image, name } = person.metadata;
								return { id, image, name };
							}),
						)}
						featuredImage={featuredImage}
						isTranslationOf={isTranslationOf}
						resources={await Promise.all(
							resources.map(async ({ value: id, discriminant: type }) => {
								const resource = await client.collections.resources.get(id);
								assert(resource, `Missing resource "${id}".`);
								return {
									authors: await Promise.all(
										resource.metadata.authors.map(async (id) => {
											const person = await client.collections.people.get(id);
											assert(person, `Missing person "${id}".`);
											const { image, name } = person.metadata;
											return { id, image, name };
										}),
									),
									kind: type,
									contentType: resource.metadata["content-type"],
									id: resource.id,
									href: resource.href,
									locale: resource.metadata.locale,
									summary: resource.metadata.summary,
									title: resource.metadata.title,
									draft: resource.metadata.draft,
								};
							}),
						)}
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
					</Curriculum>
					<RelatedCurriculaList
						curricula={await Promise.all(
							related.map(async (id) => {
								const curriculum = await client.collections.curricula.get(id);
								assert(curriculum, `Missing curriculum "${id}".`);
								return { id, title: curriculum.metadata.title, href: curriculum.href };
							}),
						)}
					/>
				</div>
			</div>
		</div>
	);
}
