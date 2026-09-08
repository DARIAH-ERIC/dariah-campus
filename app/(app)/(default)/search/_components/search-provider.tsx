"use client";

import { type ReactNode, createContext, use, useEffect, useMemo, useRef, useState } from "react";

import {
	type FacetAttribute,
	type SearchData,
	type SearchState,
	createSearchParameters,
	createSearchStateFromUrl,
	emptyFilters,
	emptySearchData,
	search,
} from "#/app/(app)/(default)/search/_lib/search.ts";
import type { SearchError } from "#/lib/search/index.ts";

interface SearchContextValue extends SearchData {
	clearFilters: () => void;
	error: SearchError | null;
	hasData: boolean;
	isLoading: boolean;
	query: string;
	setFilter: (attribute: FacetAttribute, values: Array<string>) => void;
	setQuery: (query: string) => void;
	selectedFilters: SearchState["filters"];
}

const SearchContext = createContext<SearchContextValue | null>(null);

interface SearchProviderProps {
	children: ReactNode;
	initialState: SearchState;
}

export function SearchProvider(props: Readonly<SearchProviderProps>): ReactNode {
	const { children, initialState } = props;
	const [state, setState] = useState(initialState);
	const [data, setData] = useState(emptySearchData);
	const [hasData, setHasData] = useState(false);
	const [error, setError] = useState<SearchError | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const abortControllerRef = useRef<AbortController>(null);

	useEffect(() => {
		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		void search(state, abortController.signal).then((result) => {
			result.match({
				ok(data) {
					setData(data);
					setHasData(true);
					setIsLoading(false);
				},
				err(error) {
					/** A superseded request is not a failure, the replacement will settle the state. */
					if (error._tag === "SearchAbortedError") {
						return;
					}

					setError(error);
					setIsLoading(false);
				},
			});
		});

		return () => {
			abortController.abort();
		};
	}, [state]);

	useEffect(() => {
		const searchParams = createSearchParameters(state);
		const query = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
		const url = `${window.location.pathname}${query}${window.location.hash}`;
		window.history.replaceState(window.history.state, "", url);
	}, [state]);

	useEffect(() => {
		function onPopState() {
			abortControllerRef.current?.abort();
			setIsLoading(true);
			setError(null);
			setState(createSearchStateFromUrl(new URLSearchParams(window.location.search)));
		}

		window.addEventListener("popstate", onPopState);
		return () => {
			window.removeEventListener("popstate", onPopState);
		};
	}, []);

	const value = useMemo<SearchContextValue>(() => {
		return {
			...data,
			clearFilters() {
				abortControllerRef.current?.abort();
				setIsLoading(true);
				setError(null);
				setState((state) => {
					return { ...state, filters: emptyFilters };
				});
			},
			error,
			hasData,
			isLoading,
			query: state.query,
			selectedFilters: state.filters,
			setFilter(attribute, values) {
				abortControllerRef.current?.abort();
				setIsLoading(true);
				setError(null);
				setState((state) => {
					return {
						...state,
						filters: { ...state.filters, [attribute]: values },
					};
				});
			},
			setQuery(query) {
				abortControllerRef.current?.abort();
				setIsLoading(true);
				setError(null);
				setState((state) => {
					return { ...state, query };
				});
			},
		};
	}, [data, error, hasData, isLoading, state]);

	return <SearchContext value={value}>{children}</SearchContext>;
}

export function useSearch(): SearchContextValue {
	const context = use(SearchContext);
	if (context == null) {
		throw new Error("useSearch must be used within a SearchProvider.");
	}

	return context;
}
