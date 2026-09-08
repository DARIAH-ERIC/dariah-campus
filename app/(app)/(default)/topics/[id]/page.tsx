import { assert } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PageLead } from "#/components/page-lead.tsx";
import { PageTitle } from "#/components/page-title.tsx";
import { ResourcesGrid } from "#/components/resources-grid.tsx";
import { client } from "#/lib/content/client/index.ts";
import { createClient } from "#/lib/content/create-client.ts";

interface TopicPageProps extends PageProps<"/topics/[id]"> {}

export async function generateStaticParams(): Promise<Array<Pick<Awaited<TopicPageProps["params"]>, "id">>> {
	const ids = await client.collections.tags.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(props: Readonly<TopicPageProps>): Promise<Metadata> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient();

	const tag = await client.collections.tags.get(id);

	if (tag == null) {
		notFound();
	}

	const { name } = tag.metadata;

	const metadata: Metadata = {
		title: name,
	};

	return metadata;
}

export default async function TopicPage(props: Readonly<TopicPageProps>): Promise<ReactNode> {
	const { params } = props;

	const t = await getTranslations("TopicPage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient();

	const tag = await client.collections.tags.get(id);

	if (tag == null) {
		notFound();
	}

	const { name } = tag.metadata;
	const Content = tag.content;

	const curricula = await Promise.all(
		tag.curricula.map(async (id) => {
			const curriculum = await client.collections.curricula.get(id);
			assert(curriculum, `Missing curriculum "${id}".`);
			const { "content-type": contentType, editors, locale, summary, title } = curriculum.metadata;

			const people = await Promise.all(
				editors.map(async (id) => {
					const person = await client.collections.people.get(id);
					assert(person, `Missing person "${id}".`);
					const { image, name } = person.metadata;
					return { id, name, image };
				}),
			);

			return {
				id: curriculum.id,
				collection: "curricula",
				contentType,
				href: curriculum.href,
				locale,
				people,
				summary,
				title,
			} as const;
		}),
	);

	const items = await Promise.all(
		tag.resources.map(async (id) => {
			const resource = await client.collections.resources.get(id);
			assert(resource, `Missing resource "${id}".`);
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

			return {
				id: resource.id,
				collection: `resources-${resource.kind}`,
				contentType: resource.metadata["content-type"],
				href,
				locale,
				people,
				summary,
				title,
			} as const;
		}),
	);

	return (
		<div className="mx-auto grid content-start gap-y-12 px-4 py-8 inline-full max-inline-7xl xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{name}</PageTitle>
				<PageLead>
					<Content />
				</PageLead>
			</div>
			{curricula.length > 0 ? (
				<section className="space-y-5">
					<h2 className="text-2xl font-bold">{t("curricula")}</h2>
					<ResourcesGrid peopleLabel={t("editors")} resources={curricula} />
				</section>
			) : null}
			<section className="space-y-5">
				<h2 className={curricula.length > 0 ? "text-2xl font-bold" : "sr-only"}>{t("resources")}</h2>
				<ResourcesGrid peopleLabel={t("authors")} resources={items} />
			</section>
		</div>
	);
}
