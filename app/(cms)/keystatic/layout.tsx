import "@/styles/index.css";
import "@/styles/cms.css";

import type { Metadata } from "next";
import { type ReactNode, Suspense } from "react";
import { LocalizedStringProvider as Translations } from "react-aria-components/i18n";

import KeystaticApp from "@/app/(cms)/keystatic/keystatic";
import { getMetadata } from "@/lib/i18n/get-metadata";

const locale = "en";

export async function generateMetadata(): Promise<Metadata> {
	const meta = await getMetadata();

	const metadata: Metadata = {
		title: ["CMS", meta.title].join(" | "),
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
