"use client";

import type { ReactNode } from "react";
import { SearchField as AriaSearchField, Input, Label } from "react-aria-components";

import { useSearch } from "#/app/(app)/(default)/search/_components/search-provider.tsx";

interface SearchFieldProps {
	label: string;
}

export function SearchField(props: Readonly<SearchFieldProps>): ReactNode {
	const { label } = props;

	const { query, setQuery } = useSearch();

	return (
		<AriaSearchField className="mx-auto max-w-screen-lg inline-full" onChange={setQuery} value={query}>
			<Label className="sr-only">{label}</Label>
			<Input
				className="rounded-full border border-neutral-200 bg-white px-10 py-5 inline-full focus:border-brand-700 focus:outline-none focus-visible:border-brand-700 focus-visible:ring focus-visible:ring-brand-700"
				placeholder={`${label}...`}
			/>
		</AriaSearchField>
	);
}
