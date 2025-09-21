import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ApiDocs } from "@/app/(api)/api-docs/_components/api-docs";
import { getMetadata } from "@/lib/i18n/metadata";

const locale = "en-GB";

export async function generateMetadata(): Promise<Metadata> {
	const meta = await getMetadata();

	const metadata: Metadata = {
		title: ["API Documentation", meta.title].join(" | "),
		robots: {
			index: false,
		},
	};

	return metadata;
}

export default function ApiDocsPage(): ReactNode {
	return (
		<html lang={locale}>
			<body>
				<ApiDocs />
			</body>
		</html>
	);
}
