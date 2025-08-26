import { keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Providers } from "@/app/(app)/(default)/search/_components/providers";
import { SearchField } from "@/app/(app)/(default)/search/_components/search-field";
import { SearchFilters } from "@/app/(app)/(default)/search/_components/search-filters";
import { SearchFiltersSidePanel } from "@/app/(app)/(default)/search/_components/search-filters-side-panel";
import { SearchResults } from "@/app/(app)/(default)/search/_components/search-results";
import { SearchStats } from "@/app/(app)/(default)/search/_components/search-stats";
import { PageTitle } from "@/components/page-title";
import { client } from "@/lib/content/client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("SearchPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function SearchPage(): ReactNode {
	const t = useTranslations("SearchPage");

	/**
	 * Ensure `content` fields, which are function components and cannot be passed through
	 * the server-client serialization boundary, are omitted.
	 */
	const peopleById = keyByToMap(
		client.collections.people.all().map((person) => {
			const { image, name } = person.metadata;
			return { id: person.id, image, name };
		}),
		(person) => {
			return person.id;
		},
	);
	const sourcesById = keyByToMap(
		client.collections.sources.all().map((source) => {
			const { name } = source.metadata;
			return { id: source.id, name };
		}),
		(source) => {
			return source.id;
		},
	);
	const tagsById = keyByToMap(
		client.collections.tags.all().map((tag) => {
			const { name } = tag.metadata;
			return { id: tag.id, name };
		}),
		(tag) => {
			return tag.id;
		},
	);
	const contentLanguagesById = client.collections.contentLanguages.byId();
	const contentTypesById = client.collections.contentTypes.byId();

	return (
		<Providers>
			<div className="mx-auto grid min-h-[calc(100dvh-100px)] w-full max-w-screen-xl content-start gap-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
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
							peopleById={peopleById}
							peopleLabel={t("authors-editors-contributors")}
							tagsById={tagsById}
						/>
					</section>
				</div>
			</div>
		</Providers>
	);
}
