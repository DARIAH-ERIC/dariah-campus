"use client";

import type { ReactNode } from "react";

import { SearchFacets } from "@/app/(app)/(default)/search/_components/search-facets";

interface SearchFiltersProps {
	contentTypesById: Map<string, { label: string }>;
	contentTypesFilterLabel: string;
	contentTypesLabel: string;
	filterPlaceholder: string;
	localesById: Map<string, { label: string }>;
	localeFilterLabel: string;
	localeLabel: string;
	nothingFoundLabel: string;
	peopleById: Map<string, { name: string }>;
	peopleFilterLabel: string;
	peopleLabel: string;
	showLessLabel: string;
	showMoreLabel: string;
	sourcesById: Map<string, { name: string }>;
	sourcesLabel: string;
	sourcesFilterLabel: string;
	tagsById: Map<string, { name: string }>;
	tagsFilterLabel: string;
	tagsLabel: string;
}

export function SearchFilters(props: Readonly<SearchFiltersProps>): ReactNode {
	const {
		contentTypesById,
		contentTypesFilterLabel,
		contentTypesLabel,
		filterPlaceholder,
		localesById,
		localeLabel,
		localeFilterLabel,
		nothingFoundLabel,
		peopleById,
		peopleLabel,
		peopleFilterLabel,
		showLessLabel,
		showMoreLabel,
		sourcesById,
		sourcesLabel,
		sourcesFilterLabel,
		tagsById,
		tagsLabel,
		tagsFilterLabel,
	} = props;

	return (
		<div className="contents">
			<div>
				<SearchFacets
					attribute="locale"
					filterLabel={localeFilterLabel}
					filterPlaceholder={filterPlaceholder}
					getLabel={(id: string) => {
						return localesById.get(id)?.label ?? "Unknown language";
					}}
					label={localeLabel}
					nothingFoundLabel={nothingFoundLabel}
					showLessLabel={showLessLabel}
					showMoreLabel={showMoreLabel}
				/>
			</div>

			<div>
				<SearchFacets
					attribute="tags"
					filterLabel={tagsFilterLabel}
					filterPlaceholder={filterPlaceholder}
					getLabel={(id: string) => {
						return tagsById.get(id)?.name ?? "Unknown tag";
					}}
					label={tagsLabel}
					nothingFoundLabel={nothingFoundLabel}
					showLessLabel={showLessLabel}
					showMoreLabel={showMoreLabel}
				/>
			</div>

			<div>
				<SearchFacets
					attribute="content-type"
					filterLabel={contentTypesFilterLabel}
					filterPlaceholder={filterPlaceholder}
					getLabel={(id: string) => {
						return contentTypesById.get(id)?.label ?? "Unknown content type";
					}}
					label={contentTypesLabel}
					nothingFoundLabel={nothingFoundLabel}
					showLessLabel={showLessLabel}
					showMoreLabel={showMoreLabel}
				/>
			</div>

			<div>
				<SearchFacets
					attribute="people"
					filterLabel={peopleFilterLabel}
					filterPlaceholder={filterPlaceholder}
					getLabel={(id: string) => {
						return peopleById.get(id)?.name ?? "Unknown person";
					}}
					label={peopleLabel}
					nothingFoundLabel={nothingFoundLabel}
					showLessLabel={showLessLabel}
					showMoreLabel={showMoreLabel}
				/>
			</div>

			<div>
				<SearchFacets
					attribute="sources"
					filterLabel={sourcesFilterLabel}
					filterPlaceholder={filterPlaceholder}
					getLabel={(id: string) => {
						return sourcesById.get(id)?.name ?? "Unknown source";
					}}
					label={sourcesLabel}
					nothingFoundLabel={nothingFoundLabel}
					showLessLabel={showLessLabel}
					showMoreLabel={showMoreLabel}
				/>
			</div>
		</div>
	);
}
