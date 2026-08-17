import {
	type CollectionDocument,
	type CollectionFacetableFieldName,
	type CollectionFilterableFieldName,
	type CollectionSearchableFieldName,
	type CollectionSortableFieldName,
	defineCollection,
} from "#/lib/search/schema.ts";
import type { SearchCollectionParams, SearchFacet, SearchItem, SearchResult } from "#/lib/search/search.ts";

export const websiteCollection = defineCollection({
	fields: [
		{ name: "id", type: "string", index: false },
		{ name: "source", type: "string", index: true, facet: true },
		{ name: "source_id", type: "string", index: false },
		// The knowledge-base document (entity) a document was derived from. Indexed so incremental
		// sync can enumerate every document belonging to an entity — an entity may own more than one
		// (e.g. an institution has one document per country it is located in). Only set on entity
		// documents; resource documents have no knowledge-base entity behind them.
		{ name: "entity_id", type: "string", index: true, optional: true },
		{ name: "source_updated_at", type: "int64", index: true, optional: true, sort: true },
		{ name: "imported_at", type: "int64", index: false },
		{ name: "type", type: "string", index: true, facet: true },
		{ name: "label", type: "string", index: true, sort: true },
		{ name: "description", type: "string", index: true },
		{ name: "link", type: "string", index: false, optional: true },
	] as const,
});

export const websiteEntityTypes = [
	"country",
	"document-or-policy",
	"event",
	"funding-call",
	"governance-body",
	"impact-case-study",
	"institution",
	"national-consortium",
	"news-item",
	"opportunity",
	"page",
	"person",
	"project",
	"spotlight-article",
	"working-group",
] as const;
export type WebsiteEntityType = (typeof websiteEntityTypes)[number];

export const websiteResourceTypes = ["publication", "service", "software", "training-material", "workflow"] as const;
export type WebsiteResourceType = (typeof websiteResourceTypes)[number];

export type WebsiteDocumentType = WebsiteEntityType | WebsiteResourceType;

export const websiteEntitySources = ["dariah-knowledge-base"] as const;
export type WebsiteEntitySource = (typeof websiteEntitySources)[number];

export const websiteResourceSources = [
	"dariah-campus",
	"episciences",
	"hal",
	"open-aire",
	"ssh-open-marketplace",
	"zenodo",
	"zotero",
] as const;
export type WebsiteResourceSource = (typeof websiteResourceSources)[number];

export type WebsiteDocumentSource = WebsiteEntitySource | WebsiteResourceSource;

export interface WebsiteEntityDocument extends CollectionDocument<typeof websiteCollection> {
	kind: "entity";
	entity_id: string;
	source: WebsiteEntitySource;
	type: WebsiteEntityType;
}

export interface WebsiteResourceDocument extends CollectionDocument<typeof websiteCollection> {
	kind: "resource";
	entity_id?: never;
	source: WebsiteResourceSource;
	type: WebsiteResourceType;
}

export interface WebsiteDocument extends CollectionDocument<typeof websiteCollection> {
	kind: "entity" | "resource";
	source: WebsiteDocumentSource;
	type: WebsiteDocumentType;
}

export type WebsiteSearchField = CollectionSearchableFieldName<typeof websiteCollection>;
export type WebsiteFilterField = CollectionFilterableFieldName<typeof websiteCollection>;
export type WebsiteSortField = CollectionSortableFieldName<typeof websiteCollection>;
export type WebsiteFacetField = CollectionFacetableFieldName<typeof websiteCollection>;

export type SearchWebsiteParams = SearchCollectionParams<typeof websiteCollection>;
export type WebsiteItem = SearchItem<WebsiteDocument>;
export type WebsiteFacet = SearchFacet;
export type WebsiteSearchResult = SearchResult<WebsiteDocument, WebsiteFacetField>;
