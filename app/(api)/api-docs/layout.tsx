import type { Metadata } from "next";
import type { ReactNode } from "react";

import { env } from "@/config/env.config";
import { AnalyticsScript } from "@/lib/analytics/analytics-script";
import type { IntlLocale } from "@/lib/i18n/locales";
import { getMetadata } from "@/lib/i18n/metadata";

export { viewport } from "@/app/_lib/viewport.config";

const locale: IntlLocale = "en-GB";

interface ApiLayoutProps extends LayoutProps<"/"> {}

export async function generateMetadata(): Promise<Metadata> {
	const meta = await getMetadata(locale);

	const metadata: Metadata = {
		metadataBase: new URL(env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL),
		alternates: {
			canonical: "./",
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

export default function ApiLayout(props: Readonly<ApiLayoutProps>): ReactNode {
	const { children } = props;

	return (
		<html lang={locale}>
			<body>
				{children}

				<AnalyticsScript baseUrl={env.NEXT_PUBLIC_MATOMO_BASE_URL} id={env.NEXT_PUBLIC_MATOMO_ID} />
			</body>
		</html>
	);
}
