import { keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { createResourceUrl } from "@/app/(app)/resources/_lib/create-resource-url";
import { MainContent } from "@/components/main-content";
import { MasonryLayoutList } from "@/components/masonry-layout-list";
import { PageTitle } from "@/components/page-title";
import { ResourcePreviewCard } from "@/components/resource-preview-card";
import { createClient } from "@/lib/content/create-client";

interface ResourcesPageProps extends EmptyObject {}

export const dynamic = "force-static";

export async function generateMetadata(
	_props: Readonly<ResourcesPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("ResourcesPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ResourcesPage(
	_props: Readonly<ResourcesPageProps>,
): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("ResourcesPage");

	const client = await createClient(locale);
	const resources = await client.resources.all();
	const people = await client.people.all();

	const peopleById = keyByToMap(people, (person) => {
		return person.id;
	});

	return (
		<MainContent className="mx-auto grid w-full max-w-screen-xl content-start gap-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{t("title")}</PageTitle>
			</div>
			<MasonryLayoutList>
				{resources.map((resource) => {
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

					return (
						<li key={resource.id}>
							<ResourcePreviewCard
								contentType={contentType}
								href={href}
								locale={locale}
								people={people}
								peopleLabel={t("authors")}
								summary={summary}
								title={title}
							/>
						</li>
					);
				})}
			</MasonryLayoutList>
		</MainContent>
	);
}
