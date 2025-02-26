"use client";

import { Fragment, type ReactNode } from "react";

import { SearchFacets } from "@/app/(app)/search/_components/search-facets";

interface SearchFiltersProps {
	contentTypesById: Map<string, { value: string; label: string }>;
	contentTypesFilterLabel: string;
	contentTypesLabel: string;
	filterPlaceholder: string;
	localesById: Map<string, { value: string; label: string }>;
	localeFilterLabel: string;
	localeLabel: string;
	nothingFoundLabel: string;
	peopleById: Map<string, { id: string; name: string }>;
	peopleFilterLabel: string;
	peopleLabel: string;
	showLessLabel: string;
	showMoreLabel: string;
	sourcesById: Map<string, { id: string; name: string }>;
	sourcesLabel: string;
	sourcesFilterLabel: string;
	tagsById: Map<string, { id: string; name: string }>;
	tagsFilterLabel: string;
	tagsLabel: string;
}

export function SearchFilters(props: SearchFiltersProps): ReactNode {
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
		<Fragment>
			<div className="grid gap-y-1.5">
				<h3 className="text-sm font-bold uppercase tracking-widest text-neutral-600">
					{localeLabel}
				</h3>
				<SearchFacets
					attribute="locale"
					filterLabel={localeFilterLabel}
					filterPlaceholder={filterPlaceholder}
					getLabel={(id: string) => {
						return localesById.get(id)!.label;
					}}
					nothingFoundLabel={nothingFoundLabel}
					showLessLabel={showLessLabel}
					showMoreLabel={showMoreLabel}
				/>
			</div>

			<div className="grid gap-y-1.5">
				<h3 className="text-sm font-bold uppercase tracking-widest text-neutral-600">
					{tagsLabel}
				</h3>
				<SearchFacets
					attribute="tags"
					filterLabel={tagsFilterLabel}
					filterPlaceholder={filterPlaceholder}
					getLabel={(id: string) => {
						return tagsById.get(id)!.name;
					}}
					nothingFoundLabel={nothingFoundLabel}
					showLessLabel={showLessLabel}
					showMoreLabel={showMoreLabel}
				/>
			</div>

			<div className="grid gap-y-1.5">
				<h3 className="text-sm font-bold uppercase tracking-widest text-neutral-600">
					{contentTypesLabel}
				</h3>
				<SearchFacets
					attribute="content-type"
					filterLabel={contentTypesFilterLabel}
					filterPlaceholder={filterPlaceholder}
					getLabel={(id: string) => {
						return contentTypesById.get(id)!.label;
					}}
					nothingFoundLabel={nothingFoundLabel}
					showLessLabel={showLessLabel}
					showMoreLabel={showMoreLabel}
				/>
			</div>

			<div className="grid gap-y-1.5">
				<h3 className="text-sm font-bold uppercase tracking-widest text-neutral-600">
					{peopleLabel}
				</h3>
				<SearchFacets
					attribute="people"
					filterLabel={peopleFilterLabel}
					filterPlaceholder={filterPlaceholder}
					getLabel={(id: string) => {
						return peopleById.get(id)!.name;
					}}
					nothingFoundLabel={nothingFoundLabel}
					showLessLabel={showLessLabel}
					showMoreLabel={showMoreLabel}
				/>
			</div>

			<div className="grid gap-y-1.5">
				<h3 className="text-sm font-bold uppercase tracking-widest text-neutral-600">
					{sourcesLabel}
				</h3>
				<SearchFacets
					attribute="sources"
					filterLabel={sourcesFilterLabel}
					filterPlaceholder={filterPlaceholder}
					getLabel={(id: string) => {
						return sourcesById.get(id)!.name;
					}}
					nothingFoundLabel={nothingFoundLabel}
					showLessLabel={showLessLabel}
					showMoreLabel={showMoreLabel}
				/>
			</div>
		</Fragment>
	);
}
