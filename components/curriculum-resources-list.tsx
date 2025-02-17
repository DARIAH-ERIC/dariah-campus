"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { useTableOfContentsHighlight } from "@/lib/content/use-table-of-contents-highlight";
import { createHref } from "@/lib/create-href";

interface CurriculumResourcesListProps {
	label: ReactNode;
	resources: Array<{ id: string; summary: { title: string }; title: string }>;
}

export function CurriculumResourcesList(props: CurriculumResourcesListProps) {
	const { label, resources } = props;

	const highlightId = useTableOfContentsHighlight();

	if (resources.length === 0) return null;

	const id = "curriculum-list";

	return (
		<nav aria-labelledby="curriculum-list" className="w-full space-y-2">
			<h2 className="text-xs font-bold uppercase tracking-wide text-neutral-600" id={id}>
				{label}
			</h2>
			<ol className="space-y-2">
				{resources.map((resource, index) => {
					const { id, summary, title } = resource;

					const hash = `resource-${String(index + 1)}`;
					const isCurrent = highlightId === hash;

					return (
						<li key={id}>
							<Link
								className={cn(
									"relative flex items-center space-x-1.5 rounded text-sm transition hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600",
									isCurrent && "font-bold",
								)}
								href={createHref({ hash })}
							>
								{summary.title || title}
							</Link>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
