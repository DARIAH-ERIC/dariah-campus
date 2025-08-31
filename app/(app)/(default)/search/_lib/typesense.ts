import { assert } from "@acdh-oeaw/lib";
import type { SearchClient } from "algoliasearch";
import Adapter from "typesense-instantsearch-adapter";

import { env } from "@/config/env.config";
import { limit } from "@/config/search.config";

export function createSearchClient(): SearchClient {
	const apiKey = env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY;
	assert(apiKey, "Missing NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY environment variable.");

	const adapter = new Adapter({
		additionalSearchParameters: {
			query_by: ["title", "summary", "tags"].join(","),
			limit,
		},
		server: {
			apiKey,
			nodes: [
				{
					host: env.NEXT_PUBLIC_TYPESENSE_HOST,
					port: env.NEXT_PUBLIC_TYPESENSE_PORT,
					protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
				},
			],
		},
	});

	return adapter.searchClient as SearchClient;
}
