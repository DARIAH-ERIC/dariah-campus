import { keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { createResourceUrl } from "@/app/(app)/resources/_lib/create-resource-url";
import { MainContent } from "@/components/main-content";
import { PageLead } from "@/components/page-lead";
import { PageTitle } from "@/components/page-title";
import { ResourcesList } from "@/components/resources-list";
import { createClient } from "@/lib/content/create-client";

interface SourcePageProps {
	params: Promise<{
		id: string;
	}>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<SourcePageProps["params"]>, "id">>
> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const ids = await client.sources.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: Readonly<SourcePageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const locale = await getLocale();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient(locale);
	const source = await client.sources.get(id);
	const { content, name } = source.data;

	const metadata: Metadata = {
		title: name,
		description: content,
	};

	return metadata;
}

export default async function SourcePage(props: Readonly<SourcePageProps>): Promise<ReactNode> {
	const { params } = props;

	const locale = await getLocale();
	const t = await getTranslations("SourcePage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient(locale);
	const source = await client.sources.get(id);
	const people = await client.people.all();

	const { content, name } = source.data;
	const { default: Content } = await source.compile(content);

	const peopleById = keyByToMap(people, (person) => {
		return person.id;
	});

	return (
		<MainContent className="mx-auto grid w-full max-w-screen-xl content-start space-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{name}</PageTitle>
				<PageLead>
					<Content />
				</PageLead>
			</div>
			<section className="space-y-5">
				<h2 className="sr-only">{t("resources")}</h2>
				<ResourcesList
					resources={source.resources.map((resource) => {
						const { authors, locale, summary, title } = resource.data;

						const people = authors.map((id) => {
							const person = peopleById.get(id)!;
							return { id, name: person.data.name, image: person.data.image };
						});

						const href = createResourceUrl(resource);

						const contentType =
							resource.collection === "resources-events"
								? "event"
								: resource.collection === "resources-pathfinders"
									? "pathfinder"
									: resource.data["content-type"];

						return {
							contentType,
							href,
							id: resource.id,
							locale,
							people,
							peopleLabel: t("authors"),
							summary,
							title,
						};
					})}
				/>
			</section>
		</MainContent>
	);
}
