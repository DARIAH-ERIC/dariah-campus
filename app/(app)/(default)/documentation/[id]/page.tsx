import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { FloatingTableOfContents } from "#/components/floating-table-of-contents.tsx";
import { Link } from "#/components/link.tsx";
import { PageLead } from "#/components/page-lead.tsx";
import { PageTitle } from "#/components/page-title.tsx";
import { TableOfContents } from "#/components/table-of-contents.tsx";
import { client } from "#/lib/content/client/index.ts";
import { createClient } from "#/lib/content/create-client.ts";

interface DocumentationPageProps extends PageProps<"/documentation/[id]"> {}

export async function generateStaticParams(): Promise<Array<Pick<Awaited<DocumentationPageProps["params"]>, "id">>> {
	const ids = await client.collections.documentation.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(props: Readonly<DocumentationPageProps>): Promise<Metadata> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient();

	const page = await client.collections.documentation.get(id);

	if (page == null) {
		notFound();
	}

	const { title } = page.metadata;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function DocumentationPage(props: Readonly<DocumentationPageProps>): Promise<ReactNode> {
	const { params } = props;

	const t = await getTranslations("DocumentationPage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient();

	const page = await client.collections.documentation.get(id);

	if (page == null) {
		notFound();
	}

	const { lead, title } = page.metadata;
	const Content = page.content;
	const tableOfContents = page.tableOfContents ?? [];

	const docs = await client.collections.documentation.all();

	return (
		<div>
			<div className="mx-auto grid max-w-screen-lg gap-y-10 px-4 py-8 inline-full xs:px-8 xs:py-16 2xl:grid-cols-(--content-layout) 2xl:gap-x-(--content-layout-gap) 2xl:gap-y-0 2xl:max-inline-none">
				<aside
					className="sticky inset-bs-24 hidden gap-y-8 self-start justify-self-end overflow-y-auto p-8 text-sm text-neutral-500 inline-full max-block-screen max-inline-(--size-sidebar) 2xl:flex 2xl:flex-col"
					style={{ maxHeight: "calc(100dvh - 12px - var(--page-header-height))" }}
				>
					<nav aria-labelledby="docs-nav" className="grid content-start gap-y-2 inline-full">
						<h2 className="text-xs font-bold tracking-wide text-neutral-600 uppercase" id="docs-nav">
							{t("navigation")}
						</h2>
						<ul className="grid content-start gap-y-2">
							{docs.map((doc) => {
								const href = `/documentation/${doc.id}`;

								return (
									<li key={doc.id}>
										<Link
											aria-current={doc.id === id ? "page" : undefined}
											className="relative flex items-center gap-x-1.5 rounded-sm text-sm transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700 aria-[current]:font-bold"
											href={href}
										>
											<span>{doc.metadata.title}</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>
				</aside>

				<div className="grid content-start gap-y-12 min-inline-0">
					<div className="mx-auto grid gap-y-4 max-inline-(--size-content)">
						<PageTitle>{title}</PageTitle>
						<PageLead>{lead}</PageLead>
					</div>

					<nav aria-labelledby="docs-nav" className="grid content-start gap-y-2 inline-full 2xl:hidden">
						<h2 className="text-xs font-bold tracking-wide text-neutral-600 uppercase" id="docs-nav">
							{t("navigation")}
						</h2>
						<ul className="grid content-start gap-y-2">
							{docs.map((doc) => {
								const href = `/documentation/${doc.id}`;

								return (
									<li key={doc.id}>
										<Link
											aria-current={doc.id === id ? "page" : undefined}
											className="relative flex items-center gap-x-1.5 rounded-sm text-sm transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700 aria-[current]:font-bold"
											href={href}
										>
											<span>{doc.metadata.title}</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>

					<div className="prose max-inline-(--size-content)">
						<article>
							<Content />
						</article>
					</div>
				</div>

				{tableOfContents.length > 0 ? (
					<Fragment>
						<aside
							className="sticky inset-bs-24 hidden self-start overflow-y-auto p-8 text-sm text-neutral-500 inline-full max-block-screen max-inline-(--size-sidebar) 2xl:flex 2xl:flex-col"
							style={{
								maxHeight: "calc(100dvh - 12px - var(--page-header-height))",
							}}
						>
							<TableOfContents
								aria-labelledby="table-of-contents"
								className="space-y-2 inline-full"
								tableOfContents={tableOfContents}
								title={
									<h2
										key="table-of-contents"
										className="text-xs font-bold tracking-wide text-neutral-600 uppercase"
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
		</div>
	);
}
