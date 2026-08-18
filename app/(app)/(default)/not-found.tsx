import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PageTitle } from "#/components/page-title.tsx";
import { getMetadata } from "#/lib/i18n/metadata.ts";

export { viewport } from "#/app/_lib/viewport.config.ts";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("NotFoundPage");
	const meta = await getMetadata();

	const metadata: Metadata = {
		title: [t("meta.title"), meta.title].join(" | "),
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

export default function NotFoundPage(): ReactNode {
	const t = useTranslations("NotFoundPage");

	return (
		<div className="grid place-content-center place-items-center min-block-[calc(100dvh-100px)]">
			<PageTitle>{t("title")}</PageTitle>
		</div>
	);
}
