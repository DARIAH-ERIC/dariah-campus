import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PageLead } from "@/components/page-lead";
import { PageTitle } from "@/components/page-title";
import { SourcesGrid } from "@/components/sources-grid";
import { createClient } from "@/lib/content/create-client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("SourcesPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function SourcesPage(): Promise<ReactNode> {
	const format = await getFormatter();
	const t = await getTranslations("SourcesPage");

	const client = await createClient();

	const sources = await client.collections.sources.all();

	const items = sources.map((source) => {
		const { image, name } = source.metadata;
		const Content = source.content;

		const href = `/sources/${source.id}`;

		const counts = [];

		if (source.curricula.length > 0) {
			counts.push(t("curricula", { count: source.curricula.length }));
		}

		if (source.resources.length > 0 || counts.length === 0) {
			counts.push(t("resources", { count: source.resources.length }));
		}

		return {
			id: source.id,
			name,
			content: <Content />,
			image,
			href,
			count: format.list(counts, { type: "unit" }),
		} as const;
	});

	return (
		<div className="mx-auto grid w-full max-w-7xl content-start gap-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{t("title")}</PageTitle>
				<PageLead>{t("lead")}</PageLead>
			</div>
			<SourcesGrid sources={items} />
		</div>
	);
}
