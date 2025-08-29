import { assert } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PageLead } from "@/components/page-lead";
import { PageTitle } from "@/components/page-title";
import { ResourcesGrid } from "@/components/resources-grid";
import { client } from "@/lib/content/client";

export const dynamicParams = false;

interface SourcePageProps extends PageProps<"/sources/[id]"> {}

export function generateStaticParams(): Array<Pick<Awaited<SourcePageProps["params"]>, "id">> {
	const ids = client.collections.sources.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(props: Readonly<SourcePageProps>): Promise<Metadata> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const draft = await draftMode();

	const source = draft.isEnabled
		? await (
				await (await import("@/lib/content/github-client")).createGitHubClient()
			).collections.sources.get(id)
		: client.collections.sources.get(id);

	if (source == null) {
		notFound();
	}

	const { name } = source.metadata;

	const metadata: Metadata = {
		title: name,
	};

	return metadata;
}

export default async function SourcePage(props: Readonly<SourcePageProps>): Promise<ReactNode> {
	const { params } = props;

	const t = await getTranslations("SourcePage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const draft = await draftMode();

	const source = draft.isEnabled
		? await (
				await (await import("@/lib/content/github-client")).createGitHubClient()
			).collections.sources.get(id)
		: client.collections.sources.get(id);

	if (source == null) {
		notFound();
	}

	const { name } = source.metadata;
	const Content = source.content;

	const items = source.resources.map((id) => {
		const resource = client.collections.resources.get(id);
		assert(resource, `Missing resource "${id}".`);
		const { authors, locale, summary, title } = resource.metadata;

		const people = authors.map((id) => {
			const person = client.collections.people.get(id)!;
			assert(person, `Missing person "${id}".`);
			const { image, name } = person.metadata;
			return { id, name, image };
		});

		const href = resource.href;

		return {
			id: resource.id,
			collection: resource.id,
			contentType: resource.metadata["content-type"],
			href,
			locale,
			people,
			summary,
			title,
		} as const;
	});

	return (
		<div className="mx-auto grid w-full max-w-screen-xl content-start gap-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{name}</PageTitle>
				<PageLead>
					<Content />
				</PageLead>
			</div>
			<section className="space-y-5">
				<h2 className="sr-only">{t("resources")}</h2>
				<ResourcesGrid peopleLabel={t("authors")} resources={items} />
			</section>
		</div>
	);
}
