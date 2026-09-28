import type { ReactNode } from "react";

import { type InlineLanguage, getTextDirection } from "@/lib/content/options";

interface LanguageBlockPreviewProps {
	children: ReactNode;
	lang: InlineLanguage;
}

export function LanguageBlockPreview(props: Readonly<LanguageBlockPreviewProps>): ReactNode {
	const { children, lang } = props;

	const direction = getTextDirection(lang);

	return (
		<div className={direction === "rtl" ? "text-end" : "text-start"} dir={direction} lang={lang}>
			{children}
		</div>
	);
}
