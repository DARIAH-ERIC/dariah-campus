import type { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

import { env } from "@/config/env.config";

export const cacheSearchResultsForSeconds = 60 * 60;

const collection = env.NEXT_PUBLIC_TYPESENSE_COLLECTION;

export const schema: CollectionCreateSchema = {
	name: collection,
	fields: [
		{
			name: "title",
			type: "string",
			sort: true,
		},
		{
			name: "locale",
			type: "string",
			facet: true,
		},
		{
			name: "content-type",
			type: "string",
			facet: true,
		},
		{
			name: "publication-timestamp",
			type: "int64",
			facet: true,
			sort: true,
		},
		{
			name: "people",
			type: "string[]",
			facet: true,
		},
		{
			name: "sources",
			type: "string[]",
			facet: true,
		},
		{
			name: "tags",
			type: "string[]",
			facet: true,
		},
		{
			name: "summary",
			type: "string",
		},
	],
	default_sorting_field: "publication-timestamp",
};

export interface CollectionDocument {
	id: string;
	title: string;
	locale: string;
	"content-type": string;
	"publication-timestamp": number;
	"publication-date": string;
	people: Array<string>;
	sources: Array<string>;
	tags: Array<string>;
	summary: string;
	summaryTitle: string;
}
