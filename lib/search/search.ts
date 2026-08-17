import type { CollectionFieldSchema, SearchResponseFacetCountSchema } from "typesense";

import type {
	CollectionFacetableFieldName,
	CollectionSearchableFieldName,
	CollectionSortableFieldName,
} from "#/lib/search/schema.ts";

export interface SearchSort<Field extends string> {
	field: Field;
	direction: "asc" | "desc";
}

export interface SearchFacetValue {
	count: number;
	highlighted: string;
	value: string;
	parent?: Record<string, string | number | boolean>;
}

export interface SearchFacetStats {
	avg?: number;
	max?: number;
	min?: number;
	sum?: number;
	totalValues?: number;
}

export interface SearchFacet {
	values: Array<SearchFacetValue>;
	sampled: boolean;
	stats: SearchFacetStats;
}

export interface SearchItem<Document> {
	document: Document;
	highlight: Partial<Record<keyof Document, string>>;
}

export interface SearchPagination {
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
}

export interface SearchResult<Document, FacetField extends string = string> {
	items: Array<SearchItem<Document>>;
	pagination: SearchPagination;
	facets: Partial<Record<FacetField, SearchFacet>>;
}

export interface SearchCollectionParams<Collection extends { fields: ReadonlyArray<CollectionFieldSchema> }> {
	query: string;
	page?: number;
	perPage?: number;
	queryBy?: Array<CollectionSearchableFieldName<Collection>>;
	sortBy?: Array<SearchSort<CollectionSortableFieldName<Collection>>>;
	filterBy?: string;
	facetBy?: Array<CollectionFacetableFieldName<Collection>>;
	maxFacetValues?: number;
}

export function serializeSort<Field extends string>(sortBy?: Array<SearchSort<Field>>): Array<string> | undefined {
	return sortBy?.map(({ field, direction }) => `${field}:${direction}`);
}

export type TypesenseFacetCount<Field extends string> = Omit<
	SearchResponseFacetCountSchema<Record<Field, unknown>>,
	"field_name"
> & {
	field_name: Field;
};

export function mapFacets<Field extends string>(
	facetCounts?: Array<TypesenseFacetCount<Field>>,
): Partial<Record<Field, SearchFacet>> {
	return Object.fromEntries(
		(facetCounts ?? []).map(({ field_name, counts, sampled, stats }) => [
			field_name,
			{
				values: counts,
				sampled,
				stats: {
					avg: stats.avg,
					max: stats.max,
					min: stats.min,
					sum: stats.sum,
					totalValues: stats.total_values,
				},
			},
		]),
	) as Partial<Record<Field, SearchFacet>>;
}
