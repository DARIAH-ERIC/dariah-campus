import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { ContentLanguage } from "@/lib/content/options";

interface LanguageProps {
	locale: ContentLanguage;
}

export function Language(props: Readonly<LanguageProps>): ReactNode {
	const { locale } = props;

	const t = useTranslations("Language");

	return (
		<div className="space-y-1.5">
			<h2 className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("label")}</h2>
			<p>{new Intl.DisplayNames(locale, { type: "language" }).of(locale)}</p>
		</div>
	);
}
