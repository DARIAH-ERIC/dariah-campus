import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";

import { FloatingTableOfContents } from "@/components/floating-table-of-contents";
import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { PageLead } from "@/components/page-lead";
import { PageTitle } from "@/components/page-title";
import { TableOfContents } from "@/components/table-of-contents";
import { createClient } from "@/lib/content/create-client";

interface DocumentationPageProps {
	params: Promise<{
		id: string;
	}>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<DocumentationPageProps["params"]>, "id">>
> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const ids = await client.documentation.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: Readonly<DocumentationPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const locale = await getLocale();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient(locale);
	const entry = await client.documentation.get(id);
	const { title } = entry.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function DocumentationPage(
	props: Readonly<DocumentationPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const locale = await getLocale();
	const t = await getTranslations("DocumentationPage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient(locale);
	const entry = await client.documentation.get(id);
	const { content, lead, title } = entry.data;
	const { default: Content, tableOfContents } = await entry.compile(content);

	const docs = await client.documentation.all();

	return (
		<MainContent>
			<div className="mx-auto grid w-full max-w-screen-lg gap-y-10 px-4 py-8 xs:px-8 xs:py-16 2xl:max-w-none 2xl:grid-cols-content-layout 2xl:gap-x-10 2xl:gap-y-0">
				<aside
					className="sticky top-24 hidden max-h-screen w-full max-w-xs gap-y-8 self-start justify-self-end overflow-y-auto p-8 text-sm text-neutral-500 2xl:flex 2xl:flex-col"
					style={{ maxHeight: "calc(100dvh - 12px - var(--page-header-height))" }}
				>
					<nav aria-labelledby="docs-nav" className="grid w-full content-start gap-y-2">
						<h2
							className="text-xs font-bold uppercase tracking-wide text-neutral-600"
							id="docs-nav"
						>
							{t("navigation")}
						</h2>
						<ul className="grid content-start gap-y-2">
							{docs.map((doc) => {
								const href = `/documentation/${doc.id}`;

								return (
									<li key={doc.id}>
										<Link
											aria-current={doc.id === id ? "page" : undefined}
											className="relative flex items-center gap-x-1.5 rounded text-sm transition aria-[current]:font-bold hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
											href={href}
										>
											<span>{doc.data.title}</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>
				</aside>

				<div className="grid min-w-0 content-start gap-y-12">
					<div className="grid max-w-content gap-y-4">
						<PageTitle>{title}</PageTitle>
						<PageLead>{lead}</PageLead>
					</div>

					<nav aria-labelledby="docs-nav" className="grid w-full content-start gap-y-2 2xl:hidden">
						<h2
							className="text-xs font-bold uppercase tracking-wide text-neutral-600"
							id="docs-nav"
						>
							{t("navigation")}
						</h2>
						<ul className="grid content-start gap-y-2">
							{docs.map((doc) => {
								const href = `/documentation/${doc.id}`;

								return (
									<li key={doc.id}>
										<Link
											aria-current={doc.id === id ? "page" : undefined}
											className="relative flex items-center gap-x-1.5 rounded text-sm transition aria-[current]:font-bold hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
											href={href}
										>
											<span>{doc.data.title}</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>

					<div className="prose max-w-content">
						<article>
							<Content />
						</article>
					</div>
				</div>

				{tableOfContents.length > 0 ? (
					<Fragment>
						<aside
							className="sticky top-24 hidden max-h-screen w-full max-w-xs self-start overflow-y-auto p-8 text-sm text-neutral-500 2xl:flex 2xl:flex-col"
							style={{
								maxHeight: "calc(100dvh - 12px - var(--page-header-height))",
							}}
						>
							<TableOfContents
								aria-labelledby="table-of-contents"
								className="w-full space-y-2"
								tableOfContents={tableOfContents}
								title={
									<h2
										className="text-xs font-bold uppercase tracking-wide text-neutral-600"
										id="table-of-contents"
									>
										{t("table-of-contents")}
									</h2>
								}
							/>
						</aside>
						<aside className="2xl:hidden">
							<FloatingTableOfContents
								closeLabel={t("close")}
								label={t("table-of-contents")}
								tableOfContents={tableOfContents}
								toggleLabel={t("toggle-table-of-contents")}
							/>
						</aside>
					</Fragment>
				) : null}
			</div>
		</MainContent>
	);
}
