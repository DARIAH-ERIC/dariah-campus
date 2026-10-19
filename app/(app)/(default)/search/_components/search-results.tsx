"use client";

import { assert } from "@acdh-oeaw/lib";
import cn from "clsx/lite";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { useSearch } from "#/app/(app)/(default)/search/_components/search-provider.tsx";
import { ResourcesGrid } from "#/components/resources-grid.tsx";

interface SearchResultsProps {
	peopleLabel: string;
	peopleById: Map<string, { name: string; image: StaticImageData | string }>;
}

export function SearchResults(props: Readonly<SearchResultsProps>): ReactNode {
	const { peopleLabel, peopleById } = props;

	const { error, isLoading, items: hits } = useSearch();

	const items = hits.map((hit) => {
		const {
			collection,
			href,
			id,
			"content-type": contentType,
			locale,
			people: peopleIds,
			summary,
			"summary-title": summaryTitle,
			title,
		} = hit.document;

		const people = peopleIds.map((id) => {
			const person = peopleById.get(id);
			assert(person, `Missing person "${id}".`);
			const { image, name } = person;
			return { id, image, name };
		});

		return {
			id,
			collection,
			title,
			summary: { content: summary, title: summaryTitle },
			people,
			locale,
			href,
			contentType,
		};
	});

	if (error != null) {
		return (
			<p className="text-center text-neutral-600" role="alert">
				{"Search failed."}
			</p>
		);
	}

	return (
		<div className={cn("transition-opacity", isLoading ? "opacity-75" : "opacity-100")}>
			<ResourcesGrid peopleLabel={peopleLabel} resources={items} />
		</div>
	);
}
