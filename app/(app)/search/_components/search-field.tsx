"use client";

import type { ReactNode } from "react";
import { Input, Label, SearchField as AriaSearchField } from "react-aria-components";
import { useSearchBox } from "react-instantsearch-core";

interface SearchFieldProps {
	label: string;
}

export function SearchField(props: SearchFieldProps): ReactNode {
	const { label } = props;

	const searchBox = useSearchBox();

	return (
		<AriaSearchField
			className="mx-auto w-full max-w-screen-lg"
			defaultValue={searchBox.query}
			onChange={(value) => {
				searchBox.refine(value);
			}}
		>
			<Label className="sr-only">{label}</Label>
			<Input
				className="w-full rounded-full border border-neutral-300 px-10 py-5 focus:border-primary-600 focus:outline-none focus-visible:border-primary-600 focus-visible:ring focus-visible:ring-primary-600"
				placeholder={`${label}...`}
			/>
		</AriaSearchField>
	);
}
