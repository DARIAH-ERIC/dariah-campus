"use client";

import type { ReactNode } from "react";

import { ResourcePreviewCard } from "@/components/resource-preview-card";
import type { ContentType } from "@/lib/content/options";
import { useMasonryLayout } from "@/lib/content/use-masonry-layout";

interface ResourcesGridProps {
	peopleLabel: string;
	resources: Array<{
		id: string;
		title: string;
		href: string;
		locale: string;
		people: Array<{ id: string; name: string; image: string }>;
		contentType: ContentType | "curriculum" | "event" | "pathfinder";
		summary: { content: string; title: string };
	}>;
	variant?: "default" | "search";
}

export function ResourcesGrid(props: ResourcesGridProps): ReactNode {
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
									<li key={resource.id} role="listitem">
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
					<li key={resource.id}>
						<ResourcePreviewCard peopleLabel={peopleLabel} {...resource} />
					</li>
				);
			})}
		</ul>
	);
}
