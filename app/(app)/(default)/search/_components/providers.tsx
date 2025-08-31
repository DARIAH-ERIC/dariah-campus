"use client";

import type { ReactNode } from "react";
import { InstantSearchNext as InstantSearchProvider } from "react-instantsearch-nextjs";

import { createSearchClient } from "@/app/(app)/(default)/search/_lib/typesense";
import { env } from "@/config/env.config";

const indexName = env.NEXT_PUBLIC_TYPESENSE_COLLECTION;
const searchClient = createSearchClient();

interface ProvidersProps {
	children: ReactNode;
}

export function Providers(props: Readonly<ProvidersProps>): ReactNode {
	const { children } = props;

	return (
		<InstantSearchProvider
			future={{ preserveSharedStateOnUnmount: true }}
			indexName={indexName}
			routing={{
				router: {
					cleanUrlOnDispose: false,
				},
				stateMapping: {
					stateToRoute(uiState) {
						const indexUiState = uiState[indexName]!;
						return {
							q: indexUiState.query,
							"content-type": indexUiState.refinementList?.["content-type"],
							locale: indexUiState.refinementList?.locale,
							people: indexUiState.refinementList?.people,
							sources: indexUiState.refinementList?.sources,
							tags: indexUiState.refinementList?.tags,
							page: indexUiState.page,
						};
					},
					routeToState(routeState) {
						return {
							[indexName]: {
								query: routeState.q,
								refinementList: {
									"content-type": routeState["content-type"] ?? [],
									locale: routeState.locale ?? [],
									people: routeState.people ?? [],
									sources: routeState.sources ?? [],
									tags: routeState.tags ?? [],
								},
								page: routeState.page,
							},
						};
					},
				},
			}}
			searchClient={searchClient}
		>
			{children}
		</InstantSearchProvider>
	);
}
