import { assert } from "@acdh-oeaw/lib";
import { Result } from "better-result";
import { type CollectionFieldSchema, type ConfigurationOptions, SearchClient, type SearchResponse } from "typesense";
import type { MultiSearchRequestSchema } from "typesense/lib/Typesense/Types";

import {
	type ResourceDocument,
	type ResourceFacetField,
	type ResourceSearchResult,
	type SearchResourcesParams,
	resourcesCollection,
} from "#/lib/search/collections/resources.ts";
import { SearchAbortedError, SearchError } from "#/lib/search/errors.ts";
import type { CollectionFacetableFieldName, CollectionFilterableFieldName } from "#/lib/search/schema.ts";
import {
	type SearchCollectionParams,
	type SearchOptions,
	type SearchResult,
	mapFacets,
	serializeFilter,
	serializeSort,
} from "#/lib/search/search.ts";

export type {
	ResourceDocument,
	ResourceFacetField,
	ResourceFilterField,
	ResourceItem,
	ResourceSearchField,
	ResourceSearchResult,
	ResourceSortField,
	SearchResourcesParams,
} from "#/lib/search/collections/resources.ts";
export { resourcesCollection } from "#/lib/search/collections/resources.ts";
export { SearchAbortedError, SearchError } from "#/lib/search/errors.ts";
export { toRecord } from "#/lib/search/search.ts";
export type {
	SearchCollectionParams,
	SearchFacet,
	SearchFacetMode,
	SearchFacetStats,
	SearchFacetValue,
	SearchItem,
	SearchOptions,
	SearchPagination,
	SearchRefinements,
	SearchResult,
	SearchSort,
} from "#/lib/search/search.ts";

export interface SearchServiceConfig extends Pick<
	ConfigurationOptions,
	"cacheSearchResultsForSeconds" | "connectionTimeoutSeconds" | "numRetries" | "retryIntervalSeconds"
> {}

export interface CreateSearchServiceParams {
	apiKey: string;
	nodes: Array<{ host: string; port: number; protocol: "http" | "https" }>;
	collections: {
		resources: string;
	};
	config?: SearchServiceConfig;
}

interface SearchableCollection {
	fields: ReadonlyArray<CollectionFieldSchema>;
	searchableFields: ReadonlyArray<string>;
}

/** Flattens typesense's highlight list into a lookup keyed by the field it applies to. */
function toHighlight<Document>(
	highlights: ReadonlyArray<{ field: keyof Document; snippet?: string }>,
): Partial<Record<keyof Document, string>> {
	const highlight: Partial<Record<keyof Document, string>> = {};

	for (const { field, snippet } of highlights) {
		highlight[field] = snippet ?? "";
	}

	return highlight;
}

async function searchCollection<
	Document extends object,
	Collection extends SearchableCollection,
	/** Every facetable field is also filterable, which lets facet names index `refinements`. */
	FacetField extends CollectionFacetableFieldName<Collection> & CollectionFilterableFieldName<Collection>,
>(
	client: SearchClient,
	collectionName: string,
	collection: Collection,
	searchParams: SearchCollectionParams<Collection, FacetField>,
	options?: SearchOptions,
): Promise<SearchResult<Document, FacetField>> {
	const {
		facetMode = "disjunctive",
		facets = [],
		filterBy,
		maxFacetValues,
		page = 1,
		perPage = 20,
		query,
		queryBy,
		refinements,
		sortBy,
	} = searchParams;

	/**
	 * Typesense computes facet counts against a single filter per request, so a facet whose own refinements have to be
	 * ignored needs a request of its own. Facets without active refinements are unaffected by that distinction, so they
	 * ride along on the primary request rather than costing an extra one — in practice this stays at one or two requests,
	 * not one per facet.
	 */
	const isolatedFacets =
		facetMode === "disjunctive" ? facets.filter((field) => (refinements?.[field]?.length ?? 0) > 0) : [];
	const inlineFacets = facets.filter((field) => !isolatedFacets.includes(field));

	const sharedParameters = {
		collection: collectionName,
		q: query.trim() || "*",
		query_by: [...(queryBy ?? collection.searchableFields)],
	};

	const primarySearch: MultiSearchRequestSchema<Document, string> = {
		...sharedParameters,
		page,
		per_page: perPage,
	};

	const primaryFilter = serializeFilter(refinements, filterBy);
	if (primaryFilter != null) {
		primarySearch.filter_by = primaryFilter;
	}

	const sort = serializeSort(sortBy);
	if (sort != null) {
		primarySearch.sort_by = sort;
	}

	if (inlineFacets.length > 0) {
		primarySearch.facet_by = [...inlineFacets];
		if (maxFacetValues != null) {
			primarySearch.max_facet_values = maxFacetValues;
		}
	}

	const facetSearches = isolatedFacets.map((field) => {
		const facetSearch: MultiSearchRequestSchema<Document, string> = Object.assign({}, sharedParameters, {
			facet_by: field,
			/** Only the counts are needed here, the hits come from the primary search. */
			per_page: 0,
		});

		const filter = serializeFilter(refinements, filterBy, field);
		if (filter != null) {
			facetSearch.filter_by = filter;
		}

		if (maxFacetValues != null) {
			facetSearch.max_facet_values = maxFacetValues;
		}

		return facetSearch;
	});

	const response = await client.multiSearch.perform<Array<Document>>(
		{ searches: [primarySearch, ...facetSearches] },
		{},
		options,
	);
	const results: Array<SearchResponse<Document>> = response.results;
	const [primaryResult] = results;
	assert(primaryResult, "Typesense returned no search result.");

	const resolvedPerPage = primaryResult.request_params.per_page ?? primaryResult.hits?.length ?? 0;
	const total = primaryResult.found;

	return {
		items:
			primaryResult.hits?.map((hit) => {
				return {
					document: hit.document,
					highlight: toHighlight<Document>(hit.highlights ?? []),
				};
			}) ?? [],
		pagination: {
			page: primaryResult.page,
			perPage: resolvedPerPage,
			total,
			totalPages: resolvedPerPage > 0 ? Math.ceil(total / resolvedPerPage) : 0,
		},
		facets: mapFacets(
			facets,
			results.flatMap((result) => result.facet_counts ?? []),
		),
	};
}

/** An aborted request is a cancellation by the caller, not a search failure. */
function toSearchError(cause: unknown, options?: SearchOptions): SearchAbortedError | SearchError {
	return options?.abortSignal?.aborted === true ? new SearchAbortedError({ cause }) : new SearchError({ cause });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createSearchService(params: CreateSearchServiceParams) {
	const { apiKey, collections, nodes, config } = params;

	const client = new SearchClient({
		apiKey,
		connectionTimeoutSeconds: 5,
		nodes,
		numRetries: 3,
		retryIntervalSeconds: 0.1,
		...config,
	});

	return {
		clearCache(): void {
			client.clearCache();
		},

		collections: {
			resources: {
				search<FacetField extends ResourceFacetField = never>(
					searchParams: SearchResourcesParams<FacetField>,
					options?: SearchOptions,
				): Promise<Result<ResourceSearchResult<FacetField>, SearchAbortedError | SearchError>> {
					return Result.tryPromise({
						try() {
							return searchCollection<ResourceDocument, typeof resourcesCollection, FacetField>(
								client,
								collections.resources,
								resourcesCollection,
								searchParams,
								options,
							);
						},
						catch(cause) {
							return toSearchError(cause, options);
						},
					});
				},
			},
		},
	};
}

export type SearchService = ReturnType<typeof createSearchService>;
