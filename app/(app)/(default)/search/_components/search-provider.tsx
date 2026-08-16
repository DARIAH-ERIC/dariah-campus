"use client";

import { createContext, type ReactNode, use, useEffect, useMemo, useRef, useState } from "react";

import {
	createSearchParameters,
	createSearchStateFromUrl,
	emptySearchData,
	type FacetAttribute,
	search,
	type SearchData,
	type SearchState,
} from "@/app/(app)/(default)/search/_lib/typesense";

interface SearchContextValue extends SearchData {
	error: unknown;
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
	const [error, setError] = useState<unknown>(null);
	const [isLoading, setIsLoading] = useState(true);
	const abortControllerRef = useRef<AbortController>(null);

	useEffect(() => {
		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		void search(state, abortController.signal)
			.then((data) => {
				if (!abortController.signal.aborted) setData(data);
			})
			.catch((error: unknown) => {
				if (!abortController.signal.aborted) setError(error);
			})
			.finally(() => {
				if (!abortController.signal.aborted) setIsLoading(false);
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
			error,
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
	}, [data, error, isLoading, state]);

	return <SearchContext value={value}>{children}</SearchContext>;
}

export function useSearch(): SearchContextValue {
	const context = use(SearchContext);
	if (context == null) throw new Error("useSearch must be used within a SearchProvider.");

	return context;
}
