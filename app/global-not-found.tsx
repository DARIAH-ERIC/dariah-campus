import { pick } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { useMessages, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { DocumentBody } from "@/app/_components/document-body";
import { HtmlDocument } from "@/app/_components/html-document";
import { Providers } from "@/app/_components/providers";
import { Main } from "@/components/main";
import { PageTitle } from "@/components/page-title";
import { defaultLocale } from "@/lib/i18n/locales";
import { getMetadata } from "@/lib/i18n/metadata";

export { viewport } from "@/app/_lib/viewport.config";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("GlobalNotFoundPage");
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

export default function GlobalNotFoundPage(): ReactNode {
	const locale = defaultLocale;
	const messages = useMessages();
	const t = useTranslations("GlobalNotFoundPage");

	return (
		<HtmlDocument locale={locale}>
			<DocumentBody>
				<Providers locale={locale} messages={pick(messages, ["GlobalNotFoundPage"])}>
					<Main className="grid min-h-[calc(100dvh-100px)] place-content-center place-items-center">
						<PageTitle>{t("title")}</PageTitle>
					</Main>
				</Providers>
			</DocumentBody>
		</HtmlDocument>
	);
}
