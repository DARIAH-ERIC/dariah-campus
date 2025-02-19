import type { ReactNode } from "react";

import { ResourcePreviewCard } from "@/components/resource-preview-card";
import type { ContentType } from "@/lib/content/options";

interface ResourcesListProps {
	resources: Array<{
		contentType: ContentType | "curriculum" | "event" | "pathfinder";
		href: string;
		id: string;
		locale: string;
		people: Array<{ id: string; image: string; name: string }>;
		peopleLabel: string;
		summary: { title: string; content: string };
		title: string;
	}>;
}

export function ResourcesList(props: ResourcesListProps): ReactNode {
	const { resources } = props;

	return (
		<ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			{resources.map((resource) => {
				const { contentType, href, id, locale, people, peopleLabel, summary, title } = resource;

				return (
					<li key={id}>
						<ResourcePreviewCard
							contentType={contentType}
							href={href}
							locale={locale}
							people={people}
							peopleLabel={peopleLabel}
							summary={summary}
							title={title}
						/>
					</li>
				);
			})}
		</ul>
	);
}
