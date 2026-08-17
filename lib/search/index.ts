import { Result } from "better-result";
import {
	Client,
	type CollectionFieldSchema,
	type ConfigurationOptions,
	type SearchParams,
	type SearchResponse,
} from "typesense";

import {
	type ResourceDocument,
	type ResourceFacetField,
	type ResourceSearchResult,
	type SearchResourcesParams,
	resourcesCollection,
} from "#/lib/search/collections/resources.ts";
import {
	type SearchWebsiteParams,
	type WebsiteDocument,
	type WebsiteFacetField,
	type WebsiteSearchResult,
	websiteCollection,
} from "#/lib/search/collections/website.ts";
import { SearchError } from "#/lib/search/errors.ts";
import {
	type SearchCollectionParams,
	type SearchResult,
	type TypesenseFacetCount,
	mapFacets,
	serializeSort,
} from "#/lib/search/search.ts";

export type {
	ResourceDocument,
	ResourceFacet,
	ResourceFacetField,
	ResourceFilterField,
	ResourceItem,
	ResourceSearchField,
	ResourceSearchResult,
	ResourceSortField,
	SearchResourcesParams,
} from "#/lib/search/collections/resources.ts";
export {
	resourcesCollection,
	resourceServiceKinds,
	resourceSources,
	resourceTypes,
} from "#/lib/search/collections/resources.ts";
export type {
	SearchWebsiteParams,
	WebsiteDocument,
	WebsiteEntityDocument,
	WebsiteFacet,
	WebsiteFacetField,
	WebsiteFilterField,
	WebsiteItem,
	WebsiteSearchField,
	WebsiteSearchResult,
	WebsiteSortField,
} from "#/lib/search/collections/website.ts";
export { websiteCollection, websiteEntityTypes, websiteResourceTypes } from "#/lib/search/collections/website.ts";
export type {
	SearchCollectionParams,
	SearchFacet,
	SearchFacetStats,
	SearchFacetValue,
	SearchItem,
	SearchPagination,
	SearchResult,
	SearchSort,
} from "#/lib/search/search.ts";

export interface SearchServiceConfig extends Pick<ConfigurationOptions, "cacheSearchResultsForSeconds"> {}

export interface CreateSearchServiceParams {
	apiKey: string;
	nodes: Array<{ host: string; port: number; protocol: "http" | "https" }>;
	collections: {
		resources: string;
		website: string;
	};
	config?: SearchServiceConfig;
}

function createSearchParameters<
	Document extends object,
	C extends {
		fields: ReadonlyArray<CollectionFieldSchema>;
		searchableFields: ReadonlyArray<string>;
	},
>(collection: C, searchParams: SearchCollectionParams<C>): SearchParams<Document> {
	const { facetBy, filterBy, maxFacetValues, page = 1, perPage = 20, query, queryBy, sortBy } = searchParams;

	const parameters: SearchParams<Document> = {
		q: query,
		query_by: queryBy ?? [...collection.searchableFields],
		per_page: perPage,
		page,
	};

	if (filterBy != null) {
		parameters.filter_by = filterBy;
	}

	const serializedSort = serializeSort(sortBy);
	if (serializedSort != null) {
		parameters.sort_by = serializedSort;
	}

	if (facetBy != null) {
		parameters.facet_by = facetBy;
	}

	if (maxFacetValues != null) {
		parameters.max_facet_values = maxFacetValues;
	}

	return parameters;
}

function mapSearchResponse<Document extends object, FacetField extends string>(
	result: SearchResponse<Document>,
): SearchResult<Document, FacetField> {
	const perPage = result.request_params.per_page ?? result.hits?.length ?? 0;
	const total = result.found;
	const totalPages = perPage > 0 ? Math.ceil(total / perPage) : 0;

	return {
		items:
			result.hits?.map((hit) => {
				const { document, highlights = [] } = hit;

				return {
					document,
					highlight: Object.fromEntries(highlights.map(({ field, snippet }) => [field, snippet ?? ""])) as Partial<
						Record<keyof Document, string>
					>,
				};
			}) ?? [],
		pagination: {
			page: result.page,
			perPage,
			total,
			totalPages,
		},
		facets: mapFacets(result.facet_counts as Array<TypesenseFacetCount<FacetField>> | undefined),
	};
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createSearchService(params: CreateSearchServiceParams) {
	const { apiKey, collections, nodes, config } = params;

	const client = new Client({
		apiKey,
		nodes,
		connectionTimeoutSeconds: 5,
		numRetries: 3,
		retryIntervalSeconds: 0.1,
		...config,
	});

	return {
		collections: {
			resources: {
				search(searchParams: SearchResourcesParams): Promise<Result<ResourceSearchResult, SearchError>> {
					return Result.tryPromise({
						async try() {
							const result = await client
								.collections<ResourceDocument>(collections.resources)
								.documents()
								.search(
									createSearchParameters<ResourceDocument, typeof resourcesCollection>(
										resourcesCollection,
										searchParams,
									),
								);

							return mapSearchResponse<ResourceDocument, ResourceFacetField>(result);
						},
						catch(cause) {
							return new SearchError({ cause });
						},
					});
				},
			},

			website: {
				search(searchParams: SearchWebsiteParams): Promise<Result<WebsiteSearchResult, SearchError>> {
					return Result.tryPromise({
						async try() {
							const result = await client
								.collections<WebsiteDocument>(collections.website)
								.documents()
								.search(
									createSearchParameters<WebsiteDocument, typeof websiteCollection>(websiteCollection, searchParams),
								);

							return mapSearchResponse<WebsiteDocument, WebsiteFacetField>(result);
						},
						catch(cause) {
							return new SearchError({ cause });
						},
					});
				},
			},
		},
	};
}

export type SearchService = ReturnType<typeof createSearchService>;
