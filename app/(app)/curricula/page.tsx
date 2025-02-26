import { keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { ResourcesGrid } from "@/components/resources-grid";
import { createClient } from "@/lib/content/create-client";

interface CurriculaPageProps extends EmptyObject {}

export const dynamic = "force-static";

export async function generateMetadata(
	_props: Readonly<CurriculaPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("CurriculaPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function CurriculaPage(
	_props: Readonly<CurriculaPageProps>,
): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("CurriculaPage");

	const client = await createClient(locale);

	const curricula = await client.curricula.all();
	const people = await client.people.all();

	const peopleById = keyByToMap(people, (person) => {
		return person.id;
	});

	const items = curricula.map((curriculum) => {
		const { editors, locale, summary, title } = curriculum.data;

		const people = editors.map((id) => {
			const person = peopleById.get(id)!;
			return { id, name: person.data.name, image: person.data.image };
		});

		const href = `/curricula/${curriculum.id}`;

		const contentType = "curriculum";

		return {
			id: curriculum.id,
			title,
			summary,
			people,
			href,
			locale,
			contentType,
		} as const;
	});
	return (
		<MainContent className="mx-auto grid w-full max-w-screen-xl content-start gap-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{t("title")}</PageTitle>
			</div>
			<ResourcesGrid peopleLabel={t("editors")} resources={items} />
		</MainContent>
	);
}
