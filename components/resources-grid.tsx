"use client";

import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { ResourcePreviewCard } from "#/components/resource-preview-card.tsx";
import type { ContentType } from "#/lib/content/options.ts";
import { useMasonryLayout } from "#/lib/hooks/use-masonry-layout.ts";

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
			image: StaticImageData | string;
		}>;
		contentType: ContentType | "curriculum" | "event" | "pathfinder";
		summary: { content: string; title: string };
	}>;
}

export function ResourcesGrid(props: Readonly<ResourcesGridProps>): ReactNode {
	const { peopleLabel, resources } = props;

	const columns = useMasonryLayout(resources);

	if (columns != null) {
		return (
			<ul className="flex gap-x-6">
				{columns.map((resources, index) => (
					<div key={index} className="grid flex-1 content-start gap-y-6" role="presentation">
						{resources.map((resource) => (
							<li
								key={
									// oxlint-disable-next-line @typescript-eslint/strict-boolean-expressions
									resource.collection ? [resource.collection, resource.id].join(":") : resource.id
								}
							>
								<ResourcePreviewCard peopleLabel={peopleLabel} {...resource} />
							</li>
						))}
					</div>
				))}
			</ul>
		);
	}

	return (
		<ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			{resources.map((resource) => (
				<li
					// oxlint-disable-next-line @typescript-eslint/strict-boolean-expressions
					key={resource.collection ? [resource.collection, resource.id].join(":") : resource.id}
				>
					<ResourcePreviewCard peopleLabel={peopleLabel} {...resource} />
				</li>
			))}
		</ul>
	);
}
