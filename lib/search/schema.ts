import type { CollectionCreateSchema, CollectionFieldSchema } from "typesense";

type StrictFieldSchema = CollectionFieldSchema &
	({ index?: true | undefined } | { index: false; facet?: never; sort?: never });

interface FieldTypeMap {
	string: string;
	"string[]": Array<string>;
	int32: number;
	int64: number;
	float: number;
	"int32[]": Array<number>;
	"int64[]": Array<number>;
	"float[]": Array<number>;
	bool: boolean;
	"bool[]": Array<boolean>;
	geopoint: [number, number];
	"geopoint[]": Array<[number, number]>;
	object: Record<string, unknown>;
	"object[]": Array<Record<string, unknown>>;
	auto: unknown;
	"string*": unknown;
	image: unknown;
	geopolygon: unknown;
}

type SearchableFieldType = "string" | "string[]" | "string*";

/**
 * Field selections are expressed as `Extract`/`Exclude` rather than bare conditional types so that a runtime type
 * predicate narrowing to the same type proves the mapped names match, which is what keeps the getters below free of
 * assertions.
 */
type IndexedFields<T extends CollectionFieldSchema> = Exclude<T, { index: false }>;
type SearchableFields<T extends CollectionFieldSchema> = Extract<IndexedFields<T>, { type: SearchableFieldType }>;
type SortableFields<T extends CollectionFieldSchema> = Extract<T, { sort: true }>;
type FacetableFields<T extends CollectionFieldSchema> = Extract<T, { facet: true }>;

type RequiredFieldNames<T extends CollectionFieldSchema> = Exclude<T, { optional: true }>["name"];
type OptionalFieldNames<T extends CollectionFieldSchema> = Extract<T, { optional: true }>["name"];
type QueryableFieldNames<T extends CollectionFieldSchema> = IndexedFields<T>["name"];
type SearchableFieldNames<T extends CollectionFieldSchema> = SearchableFields<T>["name"];
type FilterableFieldNames<T extends CollectionFieldSchema> = IndexedFields<T>["name"];
type SortableFieldNames<T extends CollectionFieldSchema> = SortableFields<T>["name"];
type FacetableFieldNames<T extends CollectionFieldSchema> = FacetableFields<T>["name"];

type DocumentFromFields<F extends ReadonlyArray<CollectionFieldSchema>> = {
	[K in RequiredFieldNames<F[number]>]: FieldTypeMap[Extract<F[number], { name: K }>["type"]];
} & {
	[K in OptionalFieldNames<F[number]>]?: FieldTypeMap[Extract<F[number], { name: K }>["type"]] | null;
};

const searchableFieldTypes = new Set<string>(["string", "string[]", "string*"]);

function isIndexed<T extends CollectionFieldSchema>(field: T): field is IndexedFields<T> {
	return field.index !== false;
}

function isSearchable<T extends CollectionFieldSchema>(field: T): field is SearchableFields<T> {
	return isIndexed(field) && searchableFieldTypes.has(field.type);
}

function isSortable<T extends CollectionFieldSchema>(field: T): field is SortableFields<T> {
	return field.sort === true;
}

function isFacetable<T extends CollectionFieldSchema>(field: T): field is FacetableFields<T> {
	return field.facet === true;
}

function toName<T extends CollectionFieldSchema>(field: T): T["name"] {
	return field.name;
}

function getQueryableFields<F extends ReadonlyArray<CollectionFieldSchema>>(
	fields: F,
): Array<QueryableFieldNames<F[number]>> {
	return fields
		.filter((field) => {
			return isIndexed(field);
		})
		.map((field) => {
			return toName(field);
		});
}

function getSearchableFields<F extends ReadonlyArray<CollectionFieldSchema>>(
	fields: F,
): Array<SearchableFieldNames<F[number]>> {
	return fields
		.filter((field) => {
			return isSearchable(field);
		})
		.map((field) => {
			return toName(field);
		});
}

function getFilterableFields<F extends ReadonlyArray<CollectionFieldSchema>>(
	fields: F,
): Array<FilterableFieldNames<F[number]>> {
	return fields
		.filter((field) => {
			return isIndexed(field);
		})
		.map((field) => {
			return toName(field);
		});
}

function getSortableFields<F extends ReadonlyArray<CollectionFieldSchema>>(
	fields: F,
): Array<SortableFieldNames<F[number]>> {
	return fields
		.filter((field) => {
			return isSortable(field);
		})
		.map((field) => {
			return toName(field);
		});
}

function getFacetableFields<F extends ReadonlyArray<CollectionFieldSchema>>(
	fields: F,
): Array<FacetableFieldNames<F[number]>> {
	return fields
		.filter((field) => {
			return isFacetable(field);
		})
		.map((field) => {
			return toName(field);
		});
}

export type CollectionDocument<C extends { fields: ReadonlyArray<CollectionFieldSchema> }> = DocumentFromFields<
	C["fields"]
>;
export type CollectionQueryableFieldName<C extends { fields: ReadonlyArray<CollectionFieldSchema> }> =
	QueryableFieldNames<C["fields"][number]>;
export type CollectionSearchableFieldName<C extends { fields: ReadonlyArray<CollectionFieldSchema> }> =
	SearchableFieldNames<C["fields"][number]>;
export type CollectionFilterableFieldName<C extends { fields: ReadonlyArray<CollectionFieldSchema> }> =
	FilterableFieldNames<C["fields"][number]>;
export type CollectionSortableFieldName<C extends { fields: ReadonlyArray<CollectionFieldSchema> }> =
	SortableFieldNames<C["fields"][number]>;
export type CollectionFacetableFieldName<C extends { fields: ReadonlyArray<CollectionFieldSchema> }> =
	FacetableFieldNames<C["fields"][number]>;

export interface Collection<F extends ReadonlyArray<CollectionFieldSchema>, M extends object = object> {
	fields: F;
	queryableFields: ReadonlyArray<QueryableFieldNames<F[number]>>;
	searchableFields: ReadonlyArray<SearchableFieldNames<F[number]>>;
	filterableFields: ReadonlyArray<FilterableFieldNames<F[number]>>;
	sortableFields: ReadonlyArray<SortableFieldNames<F[number]>>;
	facetableFields: ReadonlyArray<FacetableFieldNames<F[number]>>;
	defaultSortingField: SortableFieldNames<F[number]> | undefined;
	metadata: M | undefined;
	schema: (name: string) => CollectionCreateSchema;
}

export interface CollectionConfig<F extends ReadonlyArray<StrictFieldSchema>, M extends object> {
	fields: F;
	/** Must be one of the fields marked as `sort: true`. */
	defaultSortingField?: SortableFieldNames<F[number]>;
	metadata?: M;
}

export function defineCollection<F extends ReadonlyArray<StrictFieldSchema>, M extends object = object>(
	config: CollectionConfig<F, M>,
): Collection<F, M> {
	return {
		fields: config.fields,
		queryableFields: getQueryableFields(config.fields),
		searchableFields: getSearchableFields(config.fields),
		filterableFields: getFilterableFields(config.fields),
		sortableFields: getSortableFields(config.fields),
		facetableFields: getFacetableFields(config.fields),
		defaultSortingField: config.defaultSortingField,
		metadata: config.metadata,
		schema(name: string): CollectionCreateSchema {
			const schema: CollectionCreateSchema = { name, fields: [...config.fields] };

			if (config.defaultSortingField != null) {
				schema.default_sorting_field = config.defaultSortingField;
			}

			if (config.metadata != null) {
				schema.metadata = config.metadata;
			}

			return schema;
		},
	};
}
