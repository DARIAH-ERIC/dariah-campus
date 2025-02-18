import { keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AvatarsList } from "@/components/avatars-list";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/card";
import { ContentTypeIcon } from "@/components/content-type-icon";
import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { MasonryLayoutList } from "@/components/masonry-layout-list";
import { PageTitle } from "@/components/page-title";
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

	return (
		<MainContent className="mx-auto grid w-full max-w-screen-xl content-start space-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{t("title")}</PageTitle>
			</div>
			<MasonryLayoutList>
				{curricula.map((curriculum) => {
					const { editors, locale, summary, title } = curriculum.data;

					const people = editors.map((id) => {
						const person = peopleById.get(id)!;
						return { id, name: person.data.name, image: person.data.image };
					});

					const href = `/curricula/${curriculum.id}`;

					const contentType = "curriculum";

					return (
						<li key={curriculum.id}>
							<Card>
								<CardContent>
									<CardTitle>
										<Link
											className="rounded transition after:absolute after:inset-0 hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
											href={href}
										>
											<span className="mr-2 inline-flex text-brand-700">
												<ContentTypeIcon className="size-5 shrink-0" kind={contentType} />
											</span>
											<span>{summary.title || title}</span>
										</Link>
									</CardTitle>
									<div className="flex">
										<div className="rounded bg-brand-700 px-2 py-1 text-xs font-medium text-white">
											{locale.toUpperCase()}
										</div>
									</div>
									<div className="leading-7 text-neutral-500">{summary.content}</div>
								</CardContent>
								<CardFooter>
									<AvatarsList avatars={people} label={t("editors")} />
								</CardFooter>
							</Card>
						</li>
					);
				})}
			</MasonryLayoutList>
		</MainContent>
	);
}
