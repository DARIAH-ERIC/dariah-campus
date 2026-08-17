import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { ContentLanguage } from "#/lib/content/options";

interface LanguageProps {
	locale: ContentLanguage;
}

export function Language(props: Readonly<LanguageProps>): ReactNode {
	const { locale } = props;

	const t = useTranslations("Language");

	return (
		<div className="space-y-1.5">
			<dt className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("label")}</dt>
			<dd>{new Intl.DisplayNames(locale, { type: "language" }).of(locale)}</dd>
		</div>
	);
}
