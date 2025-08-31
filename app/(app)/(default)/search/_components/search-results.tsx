"use client";

import { assert } from "@acdh-oeaw/lib";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { useHits } from "react-instantsearch-core";

import { ResourcesGrid } from "@/components/resources-grid";
import type { ContentType } from "@/lib/content/options";

interface Hit {
	collection:
		| "curricula"
		| "resources-hosted"
		| "resources-external"
		| "resources-events"
		| "resources-pathfinders";
	kind: string;
	"content-type": "event" | "curriculum" | "pathfinder" | ContentType;
	id: string;
	href: string;
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
	peopleById: Map<string, { name: string; image: StaticImageData | string }>;
	tagsById: Map<string, { name: string }>;
}

export function SearchResults(props: Readonly<SearchResultsProps>): ReactNode {
	const { peopleLabel, peopleById } = props;

	const hits = useHits<Hit>();

	const items = hits.items.map((hit) => {
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
		} = hit;

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

	return <ResourcesGrid peopleLabel={peopleLabel} resources={items} variant="search" />;
}
