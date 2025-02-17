import "@/styles/index.css";

import { pick } from "@acdh-oeaw/lib";
import { cn } from "@acdh-oeaw/style-variants";
import type { Metadata, ResolvingMetadata, Viewport } from "next";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { LocalizedStringProvider as Translations } from "react-aria-components/i18n";
import { jsonLdScriptProps } from "react-schemaorg";

import { AppFooter } from "@/app/(app)/_components/app-footer";
import { AppHeader } from "@/app/(app)/_components/app-header";
import { AppLayout } from "@/app/(app)/_components/app-layout";
import { Providers } from "@/app/(app)/_components/providers";
import { TailwindIndicator } from "@/app/(app)/_components/tailwind-indicator";
import { id } from "@/components/main-content";
import { SkipLink } from "@/components/skip-link";
import { env } from "@/config/env.config";
import { AnalyticsScript } from "@/lib/analytics-script";
import * as fonts from "@/lib/fonts";
import { getMetadata } from "@/lib/i18n/get-metadata";
import { getToastMessage } from "@/lib/i18n/redirect-with-message";

interface LocaleLayoutProps {
	children: ReactNode;
}

export const viewport: Viewport = {
	colorScheme: "light",
	initialScale: 1,
	width: "device-width",
};

export async function generateMetadata(
	_props: Omit<Readonly<LocaleLayoutProps>, "children">,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "LocaleLayout" });
	const meta = await getMetadata();

	const metadata: Metadata = {
		metadataBase: new URL(env.NEXT_PUBLIC_APP_BASE_URL),
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
	const t = await getTranslations("LocaleLayout");
	const meta = await getMetadata();
	const messages = await getMessages();
	const errorPageMessages = pick(messages, ["Error"]);

	// TODO:
	const _toastMessage = await getToastMessage();

	return (
		<html
			className={cn(fonts.body.variable, "bg-neutral-50 font-body text-neutral-900 antialiased")}
			lang={locale}
		>
			<body>
				{/* @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld */}
				<script
					{...jsonLdScriptProps({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: meta.title,
						description: meta.description,
					})}
				/>

				{/**
				 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#optimizing-bundle-size
				 *
				 * TODO: only include translations for components actually used
				 *
				 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#advanced-optimization
				 */}
				<Translations locale={locale} />

				<Providers locale={locale} messages={errorPageMessages}>
					<AnalyticsScript
						baseUrl={env.NEXT_PUBLIC_MATOMO_BASE_URL}
						id={env.NEXT_PUBLIC_MATOMO_ID}
					/>

					<SkipLink targetId={id}>{t("skip-to-main-content")}</SkipLink>

					<AppLayout>
						<AppHeader />
						{children}
						<AppFooter />
					</AppLayout>
				</Providers>

				<TailwindIndicator />
			</body>
		</html>
	);
}
