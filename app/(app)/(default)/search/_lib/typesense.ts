import { assert } from "@acdh-oeaw/lib";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import SearchClient from "typesense/lib/Typesense/SearchClient";
import type { MultiSearchRequestSchema } from "typesense/lib/Typesense/Types";

import { env } from "@/config/env.config";
import { limit, maxFacetValues } from "@/config/search.config";
import type { ContentType } from "@/lib/content/options";

export const facetAttributes = ["locale", "tags", "content-type", "people", "sources"] as const;

export type FacetAttribute = (typeof facetAttributes)[number];

export interface SearchDocument {
	collection: string;
	"content-type": "curriculum" | "event" | "pathfinder" | ContentType;
	href: string;
	id: string;
	locale: string;
	people: Array<string>;
	"publication-date": string;
	"publication-timestamp": number;
	sources: Array<string>;
	summary: string;
	"summary-title": string;
	tags: Array<string>;
	title: string;
}

export interface SearchState {
	filters: Record<FacetAttribute, Array<string>>;
	query: string;
}

export interface FacetValue {
	count: number;
	value: string;
}

export interface SearchData {
	facets: Record<FacetAttribute, Array<FacetValue>>;
	found: number;
	hits: Array<SearchDocument>;
}

type SearchParameterRecord = Record<string, Array<string> | string | undefined>;

export const emptySearchData: SearchData = {
	facets: {
		"content-type": [],
		locale: [],
		people: [],
		sources: [],
		tags: [],
	},
	found: 0,
	hits: [],
};

let searchClient: SearchClient | undefined;

export function createSearchClient(): SearchClient {
	if (searchClient != null) return searchClient;

	const apiKey = env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY;
	assert(apiKey, "Missing NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY environment variable.");

	searchClient = new SearchClient({
		apiKey,
		connectionTimeoutSeconds: 3,
		nodes: [
			{
				host: env.NEXT_PUBLIC_TYPESENSE_HOST,
				port: env.NEXT_PUBLIC_TYPESENSE_PORT,
				protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
			},
		],
	});

	return searchClient;
}

export function createSearchState(searchParams: SearchParameterRecord): SearchState {
	const query = getValues(searchParams.q).at(0) ?? "";
	const filters = Object.fromEntries(
		facetAttributes.map((attribute) => {
			return [attribute, normalizeValues(getValues(searchParams[attribute]))];
		}),
	) as SearchState["filters"];

	return { filters, query };
}

export function createSearchStateFromUrl(searchParams: URLSearchParams): SearchState {
	const parameters = Object.fromEntries(
		["q", ...facetAttributes].map((name) => {
			return [name, searchParams.getAll(name)];
		}),
	);

	return createSearchState(parameters);
}

export function createSearchParameters(state: SearchState): URLSearchParams {
	const searchParams = new URLSearchParams();
	const query = state.query.trim();

	if (query !== "") searchParams.set("q", query);
	for (const attribute of facetAttributes) {
		for (const value of state.filters[attribute]) searchParams.append(attribute, value);
	}

	return searchParams;
}

export async function search(state: SearchState, abortSignal?: AbortSignal): Promise<SearchData> {
	const commonParameters = {
		collection: env.NEXT_PUBLIC_TYPESENSE_COLLECTION,
		q: state.query.trim() || "*",
		query_by: ["title", "summary", "tags"],
	};
	const searches: Array<MultiSearchRequestSchema<SearchDocument, string>> = [
		{
			...commonParameters,
			filter_by: createFilter(state.filters),
			page: 1,
			per_page: limit,
		},
		...facetAttributes.map((attribute) => {
			return {
				...commonParameters,
				/** Omit this facet's refinements to preserve disjunctive counts. */
				filter_by: createFilter(state.filters, attribute),
				facet_by: attribute,
				max_facet_values: maxFacetValues,
				per_page: 0,
			};
		}),
	];

	const response = await createSearchClient().multiSearch.perform<Array<SearchDocument>>(
		{ searches },
		{},
		{ abortSignal },
	);
	const [resultsResponse, ...facetResponses] = response.results as Array<
		SearchResponse<SearchDocument>
	>;
	assert(resultsResponse, "Typesense returned no search result.");

	const facets = Object.fromEntries(
		facetAttributes.map((attribute, index) => {
			const response = facetResponses[index];
			const facet = response?.facet_counts?.find((item) => {
				return item.field_name === attribute;
			});
			const values =
				facet?.counts.map((item) => {
					return { count: item.count, value: item.value };
				}) ?? [];

			return [attribute, values];
		}),
	) as SearchData["facets"];

	return {
		facets,
		found: resultsResponse.found,
		hits:
			resultsResponse.hits?.map((hit) => {
				return hit.document;
			}) ?? [],
	};
}

function createFilter(
	filters: SearchState["filters"],
	omitAttribute?: FacetAttribute,
): string | undefined {
	const clauses = facetAttributes.flatMap((attribute) => {
		const values = filters[attribute];
		if (attribute === omitAttribute || values.length === 0) return [];

		const escapedValues = values.map((value) => {
			return `\`${escapeFilterValue(value)}\``;
		});

		/** Values within a facet are ORed; separate facet groups are ANDed. */
		return `${attribute}:=[${escapedValues.join(",")}]`;
	});

	return clauses.length > 0 ? clauses.join(" && ") : undefined;
}

function escapeFilterValue(value: string): string {
	return value.replaceAll("\\", "\\\\").replaceAll("`", "\\`");
}

function getValues(value: Array<string> | string | undefined): Array<string> {
	return Array.isArray(value) ? value : value == null ? [] : [value];
}

function normalizeValues(values: Array<string>): Array<string> {
	return Array.from(
		new Set(
			values
				.map((value) => {
					return value.trim();
				})
				.filter(Boolean),
		),
	);
}
