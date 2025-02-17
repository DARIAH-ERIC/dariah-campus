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
	const { default: Content } = await curriculum.compile(curriculum.data.content);
	const related = pickRandom(Array.from(curriculum.related), 4);

	const people = await client.people.all();
	const peopleById = keyByToMap(people, (person) => {
		return person.id;
	});

	return (
		<MainContent>
			<div className="mx-auto grid w-full max-w-screen-lg space-y-10 px-4 py-8 xs:px-8 xs:py-16 2xl:max-w-none 2xl:grid-cols-content-layout 2xl:gap-x-10 2xl:space-y-0">
				<aside
					className="sticky top-24 hidden max-h-screen w-full max-w-xs space-y-8 justify-self-end overflow-y-auto p-8 text-sm text-neutral-500 2xl:flex 2xl:flex-col"
					style={{ maxHeight: "calc(100dvh - 12px - var(--page-header-height))" }}
				>
					<PeopleList
						label={t("editors")}
						people={curriculum.data.editors.map((person) => {
							return { id: person.id, image: person.data.image, name: person.data.name };
						})}
					/>
					<TagsList
						label={t("tags")}
						tags={curriculum.data.tags.map((tag) => {
							return { id: tag.id, name: tag.data.name };
						})}
					/>
					<CurriculumResourcesList
						label={t("overview")}
						resources={curriculum.data.resources.map((resource) => {
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
						editors={curriculum.data.editors.map((person) => {
							return { id: person.id, image: person.data.image, name: person.data.name };
						})}
						featuredImage={curriculum.data["featured-image"]}
						// FIXME:
						// lastUpdatedAt={lastUpdatedAt}
						resources={curriculum.data.resources.map((resource) => {
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
							};
						})}
						tags={curriculum.data.tags.map((tag) => {
							return { id: tag.id, name: tag.data.name };
						})}
						title={curriculum.data.title}
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
