import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { jsonLdScriptProps } from "react-schemaorg";
import type { WebSite, WithContext } from "schema-dts";

import { DocumentBody } from "@/app/_components/document-body";
import { HtmlDocument } from "@/app/_components/html-document";
import { Providers } from "@/app/_components/providers";
import { env } from "@/config/env.config";
import { AnalyticsScript } from "@/lib/analytics/analytics-script";
import { getMetadata } from "@/lib/i18n/metadata";

export { viewport } from "@/app/_lib/viewport.config";

interface LocaleLayoutProps extends LayoutProps<"/"> {}

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations("LocaleLayout");
	const meta = await getMetadata();

	const metadata: Metadata = {
		metadataBase: new URL(env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL),
		alternates: {
			canonical: "./",
			types: {
				"application/rss+xml": [{ title: t("rss-feed"), url: "/rss.xml" }],
			},
		},
		title: {
			default: meta.title,
			template: ["%s", meta.title].join(" | "),
		},
		description: meta.description,
		openGraph: {
			title: meta.title,
			description: meta.description,
			url: "./",
			siteName: meta.title,
			locale,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			creator: meta.social.twitter,
			site: meta.social.twitter,
		},
		verification: {
			google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		},
	};

	return metadata;
}

export default async function LocaleLayout(props: Readonly<LocaleLayoutProps>): Promise<ReactNode> {
	const { children } = props;

	const locale = await getLocale();
	const meta = await getMetadata();

	const schemaOrgMetadata: WithContext<WebSite> = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: meta.title,
		description: meta.description,
	};

	return (
		<HtmlDocument locale={locale}>
			<DocumentBody>
				{/* @see https://nextjs.org/docs/app/guides/json-ld */}
				<script {...jsonLdScriptProps(schemaOrgMetadata)} />

				<Providers
					locale={locale}
					/**
					 * By default, all messages are made available client-side.
					 * When explicitly passing messages, make sure to at least provide messages
					 * for the error page.
					 */
					// messages={pick(await getMessages(), "ErrorPage")}
				>
					{children}

					<AnalyticsScript
						baseUrl={env.NEXT_PUBLIC_MATOMO_BASE_URL}
						id={env.NEXT_PUBLIC_MATOMO_ID}
					/>
				</Providers>
			</DocumentBody>
		</HtmlDocument>
	);
}
