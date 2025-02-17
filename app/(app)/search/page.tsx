import { keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Providers } from "@/app/(app)/search/_components/providers";
import { SearchField } from "@/app/(app)/search/_components/search-field";
import { SearchFilters } from "@/app/(app)/search/_components/search-filters";
import { SearchFiltersSidePanel } from "@/app/(app)/search/_components/search-filters-side-panel";
import { SearchResults } from "@/app/(app)/search/_components/search-results";
import { SearchStats } from "@/app/(app)/search/_components/search-stats";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { createClient } from "@/lib/content/create-client";

interface SearchPageProps extends EmptyObject {}

export const dynamic = "force-static";

export async function generateMetadata(
	_props: Readonly<SearchPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("SearchPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function SearchPage(_props: Readonly<SearchPageProps>): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("SearchPage");

	const client = await createClient(locale);
	const people = await client.people.all();
	const sources = await client.sources.all();
	const tags = await client.tags.all();
	const contentLanguages = await client.contentLanguages.all();
	const contentTypes = await client.contentTypes.all();

	const contentLanguagesById = keyByToMap(contentLanguages, (language) => {
		return language.value;
	});
	const contentTypesById = keyByToMap(contentTypes, (contentType) => {
		return contentType.value;
	});
	const peopleById = keyByToMap(
		people.map((person) => {
			return { id: person.id, name: person.data.name, image: person.data.image };
		}),
		(person) => {
			return person.id;
		},
	);
	const sourcesById = keyByToMap(
		sources.map((tag) => {
			return { id: tag.id, name: tag.data.name };
		}),
		(tag) => {
			return tag.id;
		},
	);
	const tagsById = keyByToMap(
		tags.map((tag) => {
			return { id: tag.id, name: tag.data.name };
		}),
		(tag) => {
			return tag.id;
		},
	);

	return (
		<Providers>
			<MainContent className="mx-auto grid min-h-[calc(100dvh-100px)] w-full max-w-screen-xl content-start space-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
				<div className="grid gap-y-4">
					<PageTitle>{t("title")}</PageTitle>
				</div>

				<SearchField label={t("search")} />

				<SearchStats />

				<div className="grid gap-6 md:grid-cols-[256px_1fr]">
					<aside className="hidden content-start gap-y-8 md:grid">
						<h2 className="text-2xl font-bold">{t("search-filter")}</h2>

						<SearchFilters
							contentTypesById={contentTypesById}
							contentTypesFilterLabel={t("filter-label", { attribute: "content-type" })}
							contentTypesLabel={t("content-types")}
							filterPlaceholder={t("filter-placeholder")}
							localeFilterLabel={t("filter-label", { attribute: "locale" })}
							localeLabel={t("locale")}
							localesById={contentLanguagesById}
							nothingFoundLabel={t("nothing-found")}
							peopleById={peopleById}
							peopleFilterLabel={t("filter-label", { attribute: "people" })}
							peopleLabel={t("people")}
							showLessLabel={t("show-less-label")}
							showMoreLabel={t("show-more-label")}
							sourcesById={sourcesById}
							sourcesFilterLabel={t("filter-label", { attribute: "sources" })}
							sourcesLabel={t("sources")}
							tagsById={tagsById}
							tagsFilterLabel={t("filter-label", { attribute: "tags" })}
							tagsLabel={t("tags")}
						/>
					</aside>

					<SearchFiltersSidePanel closeLabel={t("close")} label={t("search-filter")}>
						<h2 className="text-2xl font-bold">{t("search-filter")}</h2>

						<SearchFilters
							contentTypesById={contentTypesById}
							contentTypesFilterLabel={t("filter-label", { attribute: "content-type" })}
							contentTypesLabel={t("content-types")}
							filterPlaceholder={t("filter-placeholder")}
							localeFilterLabel={t("filter-label", { attribute: "locale" })}
							localeLabel={t("locale")}
							localesById={contentLanguagesById}
							nothingFoundLabel={t("nothing-found")}
							peopleById={peopleById}
							peopleFilterLabel={t("filter-label", { attribute: "people" })}
							peopleLabel={t("people")}
							showLessLabel={t("show-less-label")}
							showMoreLabel={t("show-more-label")}
							sourcesById={sourcesById}
							sourcesFilterLabel={t("filter-label", { attribute: "sources" })}
							sourcesLabel={t("sources")}
							tagsById={tagsById}
							tagsFilterLabel={t("filter-label", { attribute: "tags" })}
							tagsLabel={t("tags")}
						/>
					</SearchFiltersSidePanel>

					<section>
						<SearchResults
							authorsLabel={t("authors")}
							peopleById={peopleById}
							tagsById={tagsById}
						/>
					</section>
				</div>
			</MainContent>
		</Providers>
	);
}
