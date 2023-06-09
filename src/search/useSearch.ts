import { type Hit } from "@algolia/client-search";
import { useEffect, useState } from "react";

import { getAlgoliaSearchIndex } from "@/search/getAlgoliaSearchIndex";
import { type IndexedCourse, type IndexedResource } from "@/search/types";
import { useDebouncedState } from "@/utils/useDebouncedState";
import {
	DEBOUNCE_MS,
	MAX_SEARCH_RESULTS,
	MIN_SEARCH_TERM_LENGTH,
	SNIPPET_WORDS,
} from "~/config/search.config";

const searchStatus = ["idle", "loading", "success", "error", "disabled"] as const;

export type SearchStatus = (typeof searchStatus)[number];

/**
 * Returns search results for search term.
 */
export function useSearch(searchTerm: string): {
	data: Array<Hit<IndexedCourse | IndexedResource>> | undefined;
	status: SearchStatus;
	error: Error | null;
} {
	const [searchIndex] = useState(() => {
		return getAlgoliaSearchIndex();
	});
	const [searchResults, setSearchResults] = useState<Array<Hit<IndexedCourse | IndexedResource>>>(
		[],
	);
	const [status, setStatus] = useState<SearchStatus>("idle");
	const [error, setError] = useState<Error | null>(null);

	const debouncedSearchTerm = useDebouncedState(searchTerm, DEBOUNCE_MS);

	useEffect(() => {
		let wasCanceled = false;

		async function search() {
			if (searchIndex == null) {
				setStatus("disabled");
				return;
			}

			const trimmedSearchTerm = debouncedSearchTerm.trim();
			if (trimmedSearchTerm.length < MIN_SEARCH_TERM_LENGTH) {
				setSearchResults((searchResults) => {
					if (searchResults.length !== 0) {
						return [];
					}
					return searchResults;
				});
				setStatus("idle");
				return;
			}

			setStatus("loading");

			try {
				const results = await searchIndex.search<IndexedCourse | IndexedResource>(
					trimmedSearchTerm,
					{
						hitsPerPage: MAX_SEARCH_RESULTS,
						attributesToRetrieve: ["type", "kind", "id", "title", "tags"],
						attributesToHighlight: ["title"],
						attributesToSnippet: [`abstract:${SNIPPET_WORDS}`],
						highlightPreTag: "<mark>",
						highlightPostTag: "</mark>",
						snippetEllipsisText: "&hellip;",
					},
				);

				if (!wasCanceled) {
					setSearchResults(results.hits);
					setStatus("success");
				}
			} catch (error) {
				if (!wasCanceled) {
					setError(error);
					setStatus("error");
				}
			}
		}

		search();

		return () => {
			wasCanceled = true;
		};
	}, [debouncedSearchTerm, searchIndex]);

	return {
		data: searchResults,
		status,
		error,
	};
}
