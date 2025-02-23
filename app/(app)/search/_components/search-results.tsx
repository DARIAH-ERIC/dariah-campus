"use client";

import { assert } from "@acdh-oeaw/lib";
import type { ReactNode } from "react";
import { useHits } from "react-instantsearch-core";

import { createResourceUrl } from "@/app/(app)/resources/_lib/create-resource-url";
import { ResourcesGrid } from "@/components/resources-grid";
import type { ContentType } from "@/lib/content/options";

interface Hit {
	collection:
		| "curricula"
		| "resources-hosted"
		| "resources-external"
		| "resources-events"
		| "resources-pathfinders";
	"content-type": "event" | "curriculum" | "pathfinder" | ContentType;
	id: string;
	locale: "en" | "de" | "sv";
	people: Array<string>;
	"publication-date": string;
	summary: string;
	"summary-title": string;
	tags: Array<string>;
	title: string;
}

interface SearchResultsProps {
	peopleLabel: string;
	peopleById: Map<string, { id: string; name: string; image: string }>;
	tagsById: Map<string, { id: string; name: string }>;
}

export function SearchResults(props: SearchResultsProps): ReactNode {
	const { peopleLabel, peopleById } = props;

	const hits = useHits<Hit>();

	const items = hits.items.map((hit) => {
		const {
			collection,
			id,
			"content-type": contentType,
			locale,
			people: peopleIds,
			summary,
			"summary-title": summaryTitle,
			title,
		} = hit;

		const href = collection === "curricula" ? `/curricula/${id}` : createResourceUrl(hit);

		const people = peopleIds.map((id) => {
			const person = peopleById.get(id);
			assert(person, `Unknown person "${id}".`);
			return person;
		});

		return {
			id,
			title,
			summary: { content: summary, title: summaryTitle },
			people,
			locale,
			href,
			contentType,
		};
	});

	return <ResourcesGrid peopleLabel={peopleLabel} resources={items} variant="search" />;
}
