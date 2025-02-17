import "@/styles/index.css";
import "@/styles/cms.css";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import { LocalizedStringProvider as Translations } from "react-aria-components/i18n";

import KeystaticApp from "@/app/(cms)/keystatic/keystatic";

const locale = "en";

export async function generateMetadata(): Promise<Metadata> {
	const meta = await getTranslations("metadata");

	const metadata: Metadata = {
		title: ["CMS", meta("title")].join(" | "),
		robots: {
			index: false,
		},
	};

	return metadata;
}

export default function RootLayout(): ReactNode {
	return (
		<html lang={locale}>
			<body>
				<Translations locale={locale} />
				<Suspense>
					<KeystaticApp />
				</Suspense>
			</body>
		</html>
	);
}
