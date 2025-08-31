import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PageTitle } from "@/components/page-title";
import { ResourcesGrid } from "@/components/resources-grid";
import { client } from "@/lib/content/client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("PathfinderResourcesPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function PathfinderResourcesPage(): ReactNode {
	const t = useTranslations("PathfinderResourcesPage");

	const resources = client.collections.resourcesPathfinders.all();
	const peopleById = client.collections.people.byId();

	const items = resources.map((resource) => {
		const { authors, locale, summary, title } = resource.metadata;

		const people = authors.map((id) => {
			const person = peopleById.get(id)!;
			const { image, name } = person.metadata;
			return { id, name, image };
		});

		const isDraft = "draft" in resource.metadata && resource.metadata.draft === true;

		const href = isDraft ? null : resource.href;

		const contentType = "pathfinder";

		return {
			id: resource.id,
			collection: `resources-${resource.kind}`,
			title,
			summary,
			people,
			href,
			locale,
			contentType,
		} as const;
	});

	return (
		<div className="mx-auto grid w-full max-w-screen-xl content-start gap-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{t("title")}</PageTitle>
			</div>
			<ResourcesGrid peopleLabel={t("authors")} resources={items} />
		</div>
	);
}
