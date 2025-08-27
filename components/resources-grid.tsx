"use client";

import type { ReactNode } from "react";

import { ResourcePreviewCard } from "@/components/resource-preview-card";
import type { ContentType } from "@/lib/content";
import { useMasonryLayout } from "@/lib/hooks/use-masonry-layout";

interface ResourcesGridProps {
	peopleLabel: string;
	resources: Array<{
		id: string;
		collection?: string;
		title: string;
		href: string | null;
		locale: string;
		people: Array<{
			id: string;
			name: string;
			image: { src: string; height: number; width: number };
		}>;
		contentType: ContentType | "curriculum" | "event" | "pathfinder";
		summary: { content: string; title: string };
	}>;
	variant?: "default" | "search";
}

export function ResourcesGrid(props: Readonly<ResourcesGridProps>): ReactNode {
	const { peopleLabel, resources, variant } = props;

	const columns = useMasonryLayout(resources, variant);

	if (columns != null) {
		return (
			<ul className="flex gap-x-6">
				{columns.map((resources, index) => {
					return (
						<div key={index} className="grid flex-1 content-start gap-y-6" role="presentation">
							{resources.map((resource) => {
								return (
									// eslint-disable-next-line jsx-a11y/no-redundant-roles
									<li
										key={
											// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
											resource.collection
												? [resource.collection, resource.id].join(":")
												: resource.id
										}
										role="listitem"
									>
										<ResourcePreviewCard peopleLabel={peopleLabel} {...resource} />
									</li>
								);
							})}
						</div>
					);
				})}
			</ul>
		);
	}

	return (
		<ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			{resources.map((resource) => {
				return (
					<li
						// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
						key={resource.collection ? [resource.collection, resource.id].join(":") : resource.id}
					>
						<ResourcePreviewCard peopleLabel={peopleLabel} {...resource} />
					</li>
				);
			})}
		</ul>
	);
}
