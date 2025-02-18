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

interface EventResourcesPageProps extends EmptyObject {}

export const dynamic = "force-static";

export async function generateMetadata(
	_props: Readonly<EventResourcesPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("EventResourcesPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function EventResourcesPage(
	_props: Readonly<EventResourcesPageProps>,
): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("EventResourcesPage");

	const client = await createClient(locale);
	const resources = await client.resources.events.all();
	const people = await client.people.all();

	const peopleById = keyByToMap(people, (person) => {
		return person.id;
	});

	return (
		<MainContent className="mx-auto grid w-full max-w-screen-xl content-start space-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
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

					const contentType = "event";

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
