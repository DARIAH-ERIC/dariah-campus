import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { compileMdx } from "@/lib/content/compile-mdx";
import { getLanguage } from "@/lib/i18n/get-language";

interface ImprintPageProps extends EmptyObject {}

export const dynamic = "force-static";

export async function generateMetadata(
	_props: Readonly<ImprintPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ImprintPage(_props: Readonly<ImprintPageProps>): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("ImprintPage");

	const filePath = join(process.cwd(), "app", "(app)", "imprint", "legal-notice.mdx");
	const fileContent = await readFile(filePath, "utf-8");
	const { default: Content } = await compileMdx(
		fileContent,
		getLanguage(locale),
		new URL(import.meta.url),
	);

	return (
		<MainContent className="mx-auto grid w-full max-w-screen-lg content-start gap-y-24 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<div className="grid gap-y-4">
				<PageTitle>{t("title")}</PageTitle>
			</div>
			<div className="prose">
				<Content />
			</div>
		</MainContent>
	);
}
