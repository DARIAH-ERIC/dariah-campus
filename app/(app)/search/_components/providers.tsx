"use client";

import type { ReactNode } from "react";
import { InstantSearch as InstantSearchProvider } from "react-instantsearch-core";

import { createSearchClient } from "@/app/(app)/search/_lib/typesense";
import { env } from "@/config/env.config";

const indexName = env.NEXT_PUBLIC_TYPESENSE_COLLECTION;
const searchClient = createSearchClient();

interface ProvidersProps {
	children: ReactNode;
}

export function Providers(props: ProvidersProps): ReactNode {
	const { children } = props;

	return (
		<InstantSearchProvider indexName={indexName} routing={true} searchClient={searchClient}>
			{children}
		</InstantSearchProvider>
	);
}
