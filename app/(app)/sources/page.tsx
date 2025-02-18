import { assert, groupByToMap } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/card";
import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { MasonryLayoutList } from "@/components/masonry-layout-list";
import { PageLead } from "@/components/page-lead";
import { PageTitle } from "@/components/page-title";
import { ServerImage as Image } from "@/components/server-image";
import { createClient } from "@/lib/content/create-client";

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

	return (
		<MainContent className="mx-auto grid w-full max-w-screen-xl content-start space-y-12 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{t("title")}</PageTitle>
				<PageLead>{t("lead")}</PageLead>
			</div>
			<MasonryLayoutList>
				{sources.map((source) => {
					const { content, image, name } = source.data;

					const href = `/sources/${source.id}`;

					const resources = resourcesBySourceId.get(source.id);
					assert(resources, `Missing resources for source "${source.id}".`);
					const count = resources.length;

					return (
						<li key={source.id}>
							<Card>
								<Image
									alt=""
									className="aspect-[1.25] border-b border-neutral-200 object-cover"
									sizes="800px"
									src={image}
								/>
								<CardContent>
									<CardTitle>
										<Link
											className="rounded transition after:absolute after:inset-0 hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
											href={href}
										>
											{name}
										</Link>
									</CardTitle>
									<div className="leading-7 text-neutral-500">{content}</div>
								</CardContent>
								<CardFooter>
									<span>{t("resources", { count })}</span>
								</CardFooter>
							</Card>
						</li>
					);
				})}
			</MasonryLayoutList>
		</MainContent>
	);
}
