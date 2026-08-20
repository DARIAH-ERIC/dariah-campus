import { keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { SearchField } from "#/app/(app)/(default)/search/_components/search-field";
import { SearchFilterBar } from "#/app/(app)/(default)/search/_components/search-filter-bar";
import { SearchProvider } from "#/app/(app)/(default)/search/_components/search-provider";
import { SearchResults } from "#/app/(app)/(default)/search/_components/search-results";
import { SearchStats } from "#/app/(app)/(default)/search/_components/search-stats";
import { createSearchState } from "#/app/(app)/(default)/search/_lib/search";
import { PageTitle } from "#/components/page-title";
import { client } from "#/lib/content/client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("SearchPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

/**
 * Person biographies are sent to the client for every person which occurs in the index, so only the opening sentences
 * travel - which is all the contextual popover on a filter chip displays.
 */
const maxDescriptionLength = 200;

function truncate(description: string): string {
	if (description.length <= maxDescriptionLength) {
		return description;
	}

	const truncated = description.slice(0, maxDescriptionLength);
	const lastSpace = truncated.lastIndexOf(" ");

	return `${(lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trimEnd()}\u2026`;
}

interface SearchPageProps {
	searchParams: Promise<Record<string, Array<string> | string | undefined>>;
}

export default async function SearchPage(props: Readonly<SearchPageProps>): Promise<ReactNode> {
	/** Not using github reader, because results returned from `typesense` will only include content from `main` branch. */
	// const client = await createClient()

	/**
	 * Ensure `content` fields, which are function components and cannot be passed through the server-client serialization
	 * boundary, are omitted.
	 */
	const [searchParams, t, people, sources, tags, contentLanguagesById, contentTypesById] = await Promise.all([
		props.searchParams,
		getTranslations("SearchPage"),
		client.collections.people.all(),
		client.collections.sources.all(),
		client.collections.tags.all(),
		client.collections.contentLanguages.byId(),
		client.collections.contentTypes.byId(),
	]);
	const peopleById = keyByToMap(
		people.map((person) => {
			const { description, image, name } = person.metadata;
			return { id: person.id, description: truncate(description), image, name };
		}),
		(person) => person.id,
	);
	const sourcesById = keyByToMap(
		sources.map((source) => {
			const { name } = source.metadata;
			return { id: source.id, name };
		}),
		(source) => source.id,
	);
	const tagsById = keyByToMap(
		tags.map((tag) => {
			const { description, name } = tag.metadata;
			return { id: tag.id, description, name };
		}),
		(tag) => tag.id,
	);
	return (
		<SearchProvider initialState={createSearchState(searchParams)}>
			<div className="mx-auto grid content-start gap-y-12 px-4 py-8 inline-full max-inline-7xl min-block-[calc(100dvh-100px)] xs:px-8 xs:py-16 md:py-24">
				<div className="grid gap-y-4">
					<PageTitle>{t("title")}</PageTitle>
				</div>

				<SearchField label={t("search")} />

				<div className="grid gap-y-6">
					<SearchFilterBar
						contentTypesById={contentTypesById}
						localesById={contentLanguagesById}
						peopleById={peopleById}
						sourcesById={sourcesById}
						tagsById={tagsById}
					/>

					<SearchStats />

					<section>
						<SearchResults peopleById={peopleById} peopleLabel={t("authors-editors-contributors")} />
					</section>
				</div>
			</div>
		</SearchProvider>
	);
}
