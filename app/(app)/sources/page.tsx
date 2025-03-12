import { assert, groupByToMap } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { PageLead } from "@/components/page-lead";
import { PageTitle } from "@/components/page-title";
import { SourcesGrid } from "@/components/sources-grid";
import { createClient } from "@/lib/content/create-client";
import { getImageDimensions } from "@/lib/server/images/get-image-dimensions";

interface SourcesPageProps extends EmptyObject {}

export const dynamic = "force-static";

export async function generateMetadata(
	_props: Readonly<SourcesPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("SourcesPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function SourcesPage(_props: Readonly<SourcesPageProps>): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("SourcesPage");

	const client = await createClient(locale);
	const sources = await client.sources.all();
	const resources = await client.resources.all();

	const resourcesBySourceId = groupByToMap(resources, (resource) => {
		return resource.data.sources;
	});

	const items = await Promise.all(
		sources.map(async (source) => {
			const { content, image, name } = source.data;

			const href = `/sources/${source.id}`;

			const dimensions = await getImageDimensions(image);
			assert(dimensions, `Invalid image dimensions "${image}".`);
			const { width, height } = dimensions;

			const resources = resourcesBySourceId.get(source.id);
			assert(resources, `Missing resources for source "${source.id}".`);
			const count = resources.length;

			return {
				id: source.id,
				name,
				image: { src: image, width, height },
				content,
				href,
				count: t("resources", { count }),
			} as const;
		}),
	);

	return (
		<MainContent className="mx-auto grid w-full max-w-screen-xl content-start gap-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{t("title")}</PageTitle>
				<PageLead>{t("lead")}</PageLead>
			</div>
			<SourcesGrid sources={items} />
		</MainContent>
	);
}
