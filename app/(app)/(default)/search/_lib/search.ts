import { assert } from "@acdh-oeaw/lib";
import type { Result } from "better-result";

import { env } from "#/configs/env.config.ts";
import { cacheSearchResultsForSeconds, limit, maxFacetValues } from "#/configs/search.config.ts";
import {
	type ResourceFacetField,
	type ResourceSearchField,
	type ResourceSearchResult,
	type SearchAbortedError,
	type SearchError,
	type SearchFacet,
	type SearchService,
	createSearchService,
	toRecord,
} from "#/lib/search/index.ts";

/** The subset of the collection's facetable fields exposed as filters, in display order. */
export const facetAttributes = [
	"locale",
	"tags",
	"content-type",
	"people",
	"sources",
] as const satisfies ReadonlyArray<ResourceFacetField>;

export type FacetAttribute = (typeof facetAttributes)[number];

const queryBy = ["title", "summary", "tags"] as const satisfies ReadonlyArray<ResourceSearchField>;

export interface SearchState {
	filters: Record<FacetAttribute, Array<string>>;
	query: string;
}

export interface SearchData extends ResourceSearchResult<FacetAttribute> {}

type SearchParameterRecord = Record<string, Array<string> | string | undefined>;

export const emptyFilters: SearchState["filters"] = toRecord(facetAttributes, () => []);

export const emptySearchData: SearchData = {
	items: [],
	pagination: { page: 1, perPage: limit, total: 0, totalPages: 0 },
	facets: toRecord(facetAttributes, (): SearchFacet => {
		return { values: [], sampled: false, stats: {} };
	}),
};

let searchService: SearchService | undefined;

function getSearchService(): SearchService {
	if (searchService != null) {
		return searchService;
	}

	const apiKey = env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY;
	assert(apiKey, "Missing NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY environment variable.");

	searchService = createSearchService({
		apiKey,
		nodes: [
			{
				host: env.NEXT_PUBLIC_TYPESENSE_HOST,
				port: env.NEXT_PUBLIC_TYPESENSE_PORT,
				protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
			},
		],
		collections: {
			resources: env.NEXT_PUBLIC_TYPESENSE_COLLECTION,
		},
		config: {
			cacheSearchResultsForSeconds,
			connectionTimeoutSeconds: 3,
		},
	});

	return searchService;
}

export function createSearchState(searchParams: SearchParameterRecord): SearchState {
	return {
		query: getValues(searchParams.q).at(0) ?? "",
		filters: toRecord(facetAttributes, (attribute) => normalizeValues(getValues(searchParams[attribute]))),
	};
}

export function createSearchStateFromUrl(searchParams: URLSearchParams): SearchState {
	const parameters = Object.fromEntries(["q", ...facetAttributes].map((name) => [name, searchParams.getAll(name)]));

	return createSearchState(parameters);
}

export function createSearchParameters(state: SearchState): URLSearchParams {
	const searchParams = new URLSearchParams();
	const query = state.query.trim();

	if (query !== "") {
		searchParams.set("q", query);
	}
	for (const attribute of facetAttributes) {
		for (const value of state.filters[attribute]) {
			searchParams.append(attribute, value);
		}
	}

	return searchParams;
}

export function search(
	state: SearchState,
	abortSignal?: AbortSignal,
): Promise<Result<SearchData, SearchAbortedError | SearchError>> {
	return getSearchService().collections.resources.search(
		{
			query: state.query,
			queryBy,
			refinements: state.filters,
			facets: facetAttributes,
			facetMode: "disjunctive",
			maxFacetValues,
			perPage: limit,
		},
		{ abortSignal },
	);
}

function getValues(value: Array<string> | string | undefined): Array<string> {
	return Array.isArray(value) ? value : value == null ? [] : [value];
}

function normalizeValues(values: Array<string>): Array<string> {
	return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}
