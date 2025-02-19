import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";

interface NotFoundPageProps extends EmptyObject {}

export async function generateMetadata(
	_props: Readonly<NotFoundPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("NotFoundPage");

	const metadata: Metadata = {
		title: t("meta.title"),
		/**
		 * Automatically set by next.js.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/not-found
		 */
		// robots: {
		// 	index: false,
		// },
	};

	return metadata;
}

export default function NotFoundPage(_props: Readonly<NotFoundPageProps>): ReactNode {
	const t = useTranslations("NotFoundPage");

	return (
		<MainContent className="grid min-h-[calc(100dvh-100px)] place-content-center place-items-center">
			<PageTitle>{t("title")}</PageTitle>
		</MainContent>
	);
}
