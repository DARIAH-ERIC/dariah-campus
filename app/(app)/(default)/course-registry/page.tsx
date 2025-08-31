import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { CourseRegistry } from "@/app/(app)/(default)/course-registry/_components/course-registry";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("CourseRegistryPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function CourseRegistryPage(): ReactNode {
	const t = useTranslations("CourseRegistryPage");

	return (
		<div className="grid">
			<h1 className="sr-only">{t("title")}</h1>
			<CourseRegistry />
		</div>
	);
}
