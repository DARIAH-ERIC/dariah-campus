import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { CourseRegistry } from "@/app/(app)/course-registry/_components/course-registry";
import { MainContent } from "@/components/main-content";

interface CourseRegistryPageProps extends EmptyObject {}

export const dynamic = "force-static";

export async function generateMetadata(
	_props: Readonly<CourseRegistryPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("CourseRegistryPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function CourseRegistryPage(
	_props: Readonly<CourseRegistryPageProps>,
): Promise<ReactNode> {
	const t = await getTranslations("CourseRegistryPage");

	return (
		<MainContent className="grid">
			<h1 className="sr-only">{t("title")}</h1>
			<CourseRegistry />
		</MainContent>
	);
}
