import { keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Curriculum } from "@/components/curriculum";
import { CurriculumResourcesList } from "@/components/curriculum-resources-list";
import { MainContent } from "@/components/main-content";
import { PeopleList } from "@/components/people-list";
import { RelatedCurriculaList } from "@/components/related-curricula-list";
import { TagsList } from "@/components/tags-list";
import { TranslationsList } from "@/components/translations-list";
import { createClient } from "@/lib/content/create-client";
import { pickRandom } from "@/lib/pick-random";

interface CurriculumPageProps {
	params: Promise<{
		id: string;
	}>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<CurriculumPageProps["params"]>, "id">>
> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const ids = await client.curricula.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: Readonly<CurriculumPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const locale = await getLocale();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient(locale);
	const curriculum = await client.curricula.get(id);
	const { summary, title } = curriculum.data;

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

	const locale = await getLocale();
	const t = await getTranslations("CurriculumPage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient(locale);
	const curriculum = await client.curricula.get(id);
	const {
		editors,
		"featured-image": featuredImage,
		resources,
		tags,
		title,
		translations: _translations,
	} = curriculum.data;
	const { default: Content } = await curriculum.compile(curriculum.data.content);
	const related = pickRandom(Array.from(curriculum.related), 4);

	const people = await client.people.all();
	const peopleById = keyByToMap(people, (person) => {
		return person.id;
	});

	const translations = await Promise.all(
		_translations.map(async (id) => {
			const curriculum = await client.curricula.get(id);
			return {
				id,
				collection: curriculum.collection,
				title: curriculum.data.title,
				locale: curriculum.data.locale,
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

					<CurriculumResourcesList
						label={t("overview")}
						resources={resources.map((resource) => {
							return {
								id: resource.id,
								summary: resource.data.summary,
								title: resource.data.title,
							};
						})}
					/>
				</aside>

				<div className="min-w-0">
					<Curriculum
						editors={editors.map((person) => {
							return { id: person.id, image: person.data.image, name: person.data.name };
						})}
						featuredImage={featuredImage}
						// FIXME:
						// lastUpdatedAt={lastUpdatedAt}
						resources={resources.map((resource) => {
							const contentType =
								resource.collection === "resources-events"
									? "event"
									: resource.collection === "resources-pathfinders"
										? "pathfinder"
										: resource.data["content-type"];

							return {
								authors: resource.data.authors.map((id) => {
									const person = peopleById.get(id)!;
									return { id: person.id, image: person.data.image, name: person.data.name };
								}),
								collection: resource.collection,
								contentType,
								id: resource.id,
								locale: resource.data.locale,
								summary: resource.data.summary,
								title: resource.data.title,
								draft: resource.data.draft,
							};
						})}
						tags={tags.map((tag) => {
							return { id: tag.id, name: tag.data.name };
						})}
						title={title}
						translations={translations}
					>
						<div className="prose">
							<Content />
						</div>
					</Curriculum>
					<RelatedCurriculaList
						curricula={related.map((resource) => {
							return { id: resource.id, title: resource.data.title };
						})}
					/>
				</div>
			</div>
		</MainContent>
	);
}
