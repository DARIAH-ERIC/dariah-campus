import { assert } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PageTitle } from "@/components/page-title";
import { ResourcesGrid } from "@/components/resources-grid";
import { client } from "@/lib/content/client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("CurriculaPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function CurriculaPage(): ReactNode {
	const t = useTranslations("CurriculaPage");

	const curricula = client.collections.curricula.all();

	const items = curricula.map((curriculum) => {
		const { "content-type": contentType, editors, locale, summary, title } = curriculum.metadata;

		const href = curriculum.href;

		return {
			id: curriculum.id,
			title,
			summary,
			people: editors.map((id) => {
				const person = client.collections.people.get(id);
				assert(person, `Missing person "${id}".`);
				const { image, name } = person.metadata;
				return { id, name, image };
			}),
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
			<ResourcesGrid peopleLabel={t("editors")} resources={items} />
		</div>
	);
}
