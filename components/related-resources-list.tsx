import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { createResourceUrl } from "@/app/(app)/resources/_lib/create-resource-url";
import { ContentTypeIcon } from "@/components/content-type-icon";
import { Link } from "@/components/link";
import type { ContentType } from "@/lib/content/options";

interface RelatedResourcesListProps {
	resources: Array<{
		collection: string;
		id: string;
		title: string;
		contentType: ContentType | "curriculum" | "event" | "pathfinder";
	}>;
}

export function RelatedResourcesList(props: RelatedResourcesListProps): ReactNode {
	const { resources } = props;

	const t = useTranslations("RelatedResourcesList");

	if (resources.length === 0) return null;

	const id = "related-resources";

	return (
		<nav
			aria-labelledby={id}
			className="mx-auto mb-12 w-full max-w-80ch space-y-3 border-t border-neutral-200 py-12"
		>
			<h2 className="text-xs font-bold uppercase tracking-wide text-neutral-600" id={id}>
				{t("label")}
			</h2>
			<ul className="flex flex-col space-y-1.5 text-sm text-neutral-500">
				{resources.map((resource) => {
					const { collection, contentType, id, title } = resource;

					const href = createResourceUrl({ id, collection });

					return (
						<li key={resource.id}>
							<Link
								className="flex items-center space-x-1.5 transition hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
								href={href}
							>
								<ContentTypeIcon className="size-3 shrink-0 text-primary-600" kind={contentType} />
								<span>{title}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
