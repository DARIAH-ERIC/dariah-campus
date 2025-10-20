import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PageTitle } from "@/components/page-title";
import { client } from "@/lib/content/client";

export const revalidate = 2592000; /** 30 days. */

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ImprintPage(): Promise<ReactNode> {
	const t = await getTranslations("ImprintPage");

	const Content = (await client.singletons.legalNotice.get()).content;

	return (
		<div className="mx-auto grid w-full max-w-screen-lg content-start gap-y-24 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{t("title")}</PageTitle>
			</div>
			<div className="prose">
				<Content />
			</div>
		</div>
	);
}
