"use client";

import type { ReactNode } from "react";

import { SourceCard } from "@/components/source-card";
import { useMasonryLayout } from "@/lib/hooks/use-masonry-layout";

interface SourcesGridProps {
	sources: Array<{
		id: string;
		name: string;
		count: string;
		href: string;
		image: { src: string; height: number; width: number };
		content: ReactNode;
	}>;
}

export function SourcesGrid(props: Readonly<SourcesGridProps>): ReactNode {
	const { sources } = props;

	const columns = useMasonryLayout(sources);

	if (columns != null) {
		return (
			<ul className="flex space-x-6">
				{columns.map((sources, index) => {
					return (
						<div key={index} className="flex-1 space-y-6" role="presentation">
							{sources.map((source) => {
								return (
									// eslint-disable-next-line jsx-a11y/no-redundant-roles
									<li key={source.id} role="listitem">
										<SourceCard {...source} />
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
			{sources.map((source) => {
				return (
					<li key={source.id}>
						<SourceCard {...source} />
					</li>
				);
			})}
		</ul>
	);
}
