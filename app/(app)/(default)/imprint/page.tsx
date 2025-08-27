import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PageTitle } from "@/components/page-title";
import { client } from "@/lib/content";

export const revalidate = 2592000; /** 30 days. */

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function ImprintPage(): ReactNode {
	const t = useTranslations("ImprintPage");

	const Content = client.singletons.legalNotice.get().content;

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
