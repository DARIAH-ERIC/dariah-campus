import {
	type CollectionDocument,
	type CollectionFacetableFieldName,
	type CollectionFilterableFieldName,
	type CollectionSearchableFieldName,
	type CollectionSortableFieldName,
	defineCollection,
} from "#/lib/search/schema.ts";
import type { SearchCollectionParams, SearchFacet, SearchItem, SearchResult } from "#/lib/search/search.ts";

export const resourcesCollection = defineCollection({
	fields: [
		{ name: "title", type: "string", index: true, sort: true },
		{ name: "locale", type: "string", index: true, facet: true },
		{ name: "content-type", type: "string", index: true, facet: true },
		{ name: "publication-timestamp", type: "int64", index: true, facet: true, sort: true },
		{ name: "people", type: "string[]", index: true, facet: true },
		{ name: "sources", type: "string[]", index: true, facet: true },
		{ name: "tags", type: "string[]", index: true, facet: true },
		{ name: "summary", type: "string", index: true },

		{ name: "id", type: "string", index: false },
		{ name: "collection", type: "string", index: false },
		{ name: "href", type: "string", index: false },
		{ name: "publication-date", type: "string", index: false },
		{ name: "authors", type: "string[]", index: false },
		{ name: "editors", type: "string[]", index: false },
		{ name: "contributors", type: "string[]", index: false },
		{ name: "summary-title", type: "string", index: false },
	] as const,
	defaultSortingField: "publication-timestamp",
	metadata: {
		description: "DARIAH-Campus",
		owners: ["stefan.probst@oeaw.ac.at"],
		service_ids: [16225],
	},
});

export interface ResourceDocument extends CollectionDocument<typeof resourcesCollection> { }

export type ResourceSearchField = CollectionSearchableFieldName<typeof resourcesCollection>;
export type ResourceFilterField = CollectionFilterableFieldName<typeof resourcesCollection>;
export type ResourceSortField = CollectionSortableFieldName<typeof resourcesCollection>;
export type ResourceFacetField = CollectionFacetableFieldName<typeof resourcesCollection>;

export type SearchResourcesParams = SearchCollectionParams<typeof resourcesCollection>;
export type ResourceItem = SearchItem<ResourceDocument>;
export type ResourceFacet = SearchFacet;
export type ResourceSearchResult = SearchResult<ResourceDocument, ResourceFacetField>;
