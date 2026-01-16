import { assert } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PageTitle } from "@/components/page-title";
import { ResourcesGrid } from "@/components/resources-grid";
import { createClient } from "@/lib/content/create-client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ResourcesPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ResourcesPage(): Promise<ReactNode> {
	const t = await getTranslations("ResourcesPage");

	const client = await createClient();

	const resources = await client.collections.resources.all();

	const items = await Promise.all(
		resources.map(async (resource) => {
			const { authors, locale, summary, title } = resource.metadata;

			const people = await Promise.all(
				authors.map(async (id) => {
					const person = await client.collections.people.get(id);
					assert(person, `Missing person "${id}".`);
					const { image, name } = person.metadata;
					return { id, name, image };
				}),
			);

			const isDraft = "draft" in resource.metadata && resource.metadata.draft === true;

			const href = isDraft ? null : resource.href;

			const contentType = resource.metadata["content-type"];

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
		}),
	);

	return (
		<div className="mx-auto grid w-full max-w-7xl content-start gap-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{t("title")}</PageTitle>
			</div>
			<ResourcesGrid peopleLabel={t("authors")} resources={items} />
		</div>
	);
}
