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

type RequiredFieldNames<T extends CollectionFieldSchema> = T extends { optional: true } ? never : T["name"];
type OptionalFieldNames<T extends CollectionFieldSchema> = T extends { optional: true } ? T["name"] : never;
type QueryableFieldNames<T extends CollectionFieldSchema> = T extends { index: false } ? never : T["name"];
type SearchableFieldNames<T extends CollectionFieldSchema> = T extends { index: false }
	? never
	: T["type"] extends SearchableFieldType
		? T["name"]
		: never;
type FilterableFieldNames<T extends CollectionFieldSchema> = T extends { index: false } ? never : T["name"];
type SortableFieldNames<T extends CollectionFieldSchema> = T extends { sort: true } ? T["name"] : never;
type FacetableFieldNames<T extends CollectionFieldSchema> = T extends { facet: true } ? T["name"] : never;

type DocumentFromFields<F extends ReadonlyArray<CollectionFieldSchema>> = {
	[K in RequiredFieldNames<F[number]>]: FieldTypeMap[Extract<F[number], { name: K }>["type"]];
} & {
	[K in OptionalFieldNames<F[number]>]?: FieldTypeMap[Extract<F[number], { name: K }>["type"]] | null;
};

function getQueryableFields<F extends ReadonlyArray<CollectionFieldSchema>>(
	fields: F,
): Array<QueryableFieldNames<F[number]>> {
	return fields.filter((f) => f.index !== false).map((f) => f.name) as Array<QueryableFieldNames<F[number]>>;
}

function getSearchableFields<F extends ReadonlyArray<CollectionFieldSchema>>(
	fields: F,
): Array<SearchableFieldNames<F[number]>> {
	return fields
		.filter((f) => f.index !== false && ["string", "string[]", "string*"].includes(f.type))
		.map((f) => f.name) as Array<SearchableFieldNames<F[number]>>;
}

function getFilterableFields<F extends ReadonlyArray<CollectionFieldSchema>>(
	fields: F,
): Array<FilterableFieldNames<F[number]>> {
	return fields.filter((f) => f.index !== false).map((f) => f.name) as Array<FilterableFieldNames<F[number]>>;
}

function getSortableFields<F extends ReadonlyArray<CollectionFieldSchema>>(
	fields: F,
): Array<SortableFieldNames<F[number]>> {
	return fields.filter((f) => f.sort === true).map((f) => f.name) as Array<SortableFieldNames<F[number]>>;
}

function getFacetableFields<F extends ReadonlyArray<CollectionFieldSchema>>(
	fields: F,
): Array<FacetableFieldNames<F[number]>> {
	return fields.filter((f) => f.facet === true).map((f) => f.name) as Array<FacetableFieldNames<F[number]>>;
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
	schema(name: string): CollectionCreateSchema;
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
