"use client";

import type { ReactNode } from "react";
import { useHits } from "react-instantsearch-core";

import { createResourceUrl } from "@/app/(app)/resources/_lib/create-resource-url";
import { AvatarsList } from "@/components/avatars-list";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/card";
import { ContentTypeIcon } from "@/components/content-type-icon";
import { Link } from "@/components/link";
import { MasonryLayoutList } from "@/components/masonry-layout-list";
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
	authorsLabel: string;
	peopleById: Map<string, { id: string; name: string; image: string }>;
	tagsById: Map<string, { id: string; name: string }>;
}

export function SearchResults(props: SearchResultsProps): ReactNode {
	const { authorsLabel, peopleById } = props;

	const hits = useHits<Hit>();

	return (
		<MasonryLayoutList variant="search">
			{hits.items.map((hit) => {
				const {
					collection,
					id,
					"content-type": contentType,
					people,
					summary,
					"summary-title": summaryTitle,
					title,
				} = hit;

				const href = collection === "curricula" ? `/curricula/${id}` : createResourceUrl(hit);

				return (
					<li key={id}>
						<Card>
							<CardContent>
								<CardTitle>
									<Link
										className="rounded transition after:absolute after:inset-0 hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
										href={href}
									>
										<span className="mr-2 inline-flex text-brand-700">
											<ContentTypeIcon className="size-5 shrink-0" kind={contentType} />
										</span>
										<span>{summaryTitle || title}</span>
									</Link>
								</CardTitle>
								<div className="leading-7 text-neutral-500">{summary}</div>
							</CardContent>
							<CardFooter>
								<AvatarsList
									avatars={people.map((id) => {
										return peopleById.get(id)!;
									})}
									label={authorsLabel}
								/>
							</CardFooter>
						</Card>
					</li>
				);
			})}
		</MasonryLayoutList>
	);
}
