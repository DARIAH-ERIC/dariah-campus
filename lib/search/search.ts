import type { CollectionFieldSchema } from "typesense";

import type {
	CollectionFacetableFieldName,
	CollectionFilterableFieldName,
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

export interface SearchResult<Document, FacetField extends string = never> {
	items: Array<SearchItem<Document>>;
	pagination: SearchPagination;
	/** Holds an entry for every requested facet field, even when it matched no values. */
	facets: Record<FacetField, SearchFacet>;
}

/**
 * How facet counts are computed while refinements are active.
 *
 * - `"conjunctive"`: every facet's counts reflect all active refinements. Narrowing one facet shrinks the values offered
 *   by the others.
 * - `"disjunctive"`: a facet's counts ignore that facet's own refinements, so its sibling values stay visible and
 *   selectable after a value has been picked. This is what a checkbox filter list normally wants.
 */
export type SearchFacetMode = "conjunctive" | "disjunctive";

/** Values within a field are ORed, separate fields are ANDed. */
export type SearchRefinements<Field extends string> = Partial<Record<Field, ReadonlyArray<string>>>;

export interface SearchCollectionParams<
	Collection extends { fields: ReadonlyArray<CollectionFieldSchema> },
	FacetField extends CollectionFacetableFieldName<Collection> = never,
> {
	query: string;
	page?: number;
	perPage?: number;
	/** Defaults to every searchable field of the collection. */
	queryBy?: ReadonlyArray<CollectionSearchableFieldName<Collection>>;
	sortBy?: ReadonlyArray<SearchSort<CollectionSortableFieldName<Collection>>>;
	refinements?: SearchRefinements<CollectionFilterableFieldName<Collection>>;
	/** Raw typesense filter expression, ANDed with `refinements`. */
	filterBy?: string;
	facets?: ReadonlyArray<FacetField>;
	/** @default "disjunctive" */
	facetMode?: SearchFacetMode;
	maxFacetValues?: number;
}

export interface SearchOptions {
	abortSignal?: AbortSignal;
}

/**
 * Builds a record from a known set of keys. `Object.fromEntries` would widen them back to `string`, losing the
 * guarantee that every key is present — which is what lets callers index the result without a null check.
 */
export function toRecord<Key extends string, Value>(
	keys: ReadonlyArray<Key>,
	getValue: (key: Key) => Value,
): Record<Key, Value> {
	const record = {} as Record<Key, Value>;

	for (const key of keys) {
		record[key] = getValue(key);
	}

	return record;
}

export function serializeSort<Field extends string>(
	sortBy?: ReadonlyArray<SearchSort<Field>>,
): Array<string> | undefined {
	if (sortBy == null || sortBy.length === 0) return undefined;

	return sortBy.map(({ field, direction }) => {
		return `${field}:${direction}`;
	});
}

function escapeFilterValue(value: string): string {
	return value.replaceAll("\\", "\\\\").replaceAll("`", "\\`");
}

/**
 * Serializes refinements into a typesense filter expression. Passing `omitField` drops that field's refinements, which
 * is how disjunctive facet counts are obtained.
 */
export function serializeFilter<Field extends string>(
	refinements: SearchRefinements<Field> | undefined,
	filterBy?: string,
	omitField?: Field,
): string | undefined {
	const clauses: Array<string> = [];

	/**
	 * Fields and values are sorted because both are commutative here, so equivalent refinements should serialize
	 * identically — otherwise the same selection can miss the result cache purely because the caller built the object or
	 * the url in a different order.
	 */
	const entries = Object.entries<ReadonlyArray<string> | undefined>(refinements ?? {}).toSorted(([a], [b]) => {
		return a < b ? -1 : a > b ? 1 : 0;
	});

	for (const [field, values] of entries) {
		if (field === omitField || values == null || values.length === 0) continue;

		const escapedValues = values.toSorted().map((value) => {
			return `\`${escapeFilterValue(value)}\``;
		});

		clauses.push(`${field}:=[${escapedValues.join(",")}]`);
	}

	if (filterBy != null && filterBy !== "") {
		clauses.push(`(${filterBy})`);
	}

	return clauses.length > 0 ? clauses.join(" && ") : undefined;
}

/**
 * The parts of a typesense facet count this module reads. Keeping `field_name` as a `PropertyKey` rather than tying it
 * to the document type lets any `SearchResponseFacetCountSchema` be passed in without an assertion — the field is only
 * ever used as a lookup key.
 */
interface FacetCount {
	field_name: PropertyKey;
	counts: Array<SearchFacetValue>;
	sampled: boolean;
	stats: {
		avg?: number;
		max?: number;
		min?: number;
		sum?: number;
		total_values?: number;
	};
}

/**
 * Collects facet counts, which may be spread over several responses when computed disjunctively, into one entry per
 * requested field.
 */
export function mapFacets<Field extends string>(
	fields: ReadonlyArray<Field>,
	facetCounts: ReadonlyArray<FacetCount>,
): Record<Field, SearchFacet> {
	const facetCountsByField = new Map(
		facetCounts.map((facetCount) => {
			return [facetCount.field_name, facetCount];
		}),
	);

	return toRecord(fields, (field) => {
		const facetCount = facetCountsByField.get(field);

		return {
			values: facetCount?.counts ?? [],
			sampled: facetCount?.sampled ?? false,
			stats: {
				avg: facetCount?.stats.avg,
				max: facetCount?.stats.max,
				min: facetCount?.stats.min,
				sum: facetCount?.stats.sum,
				totalValues: facetCount?.stats.total_values,
			},
		};
	});
}
