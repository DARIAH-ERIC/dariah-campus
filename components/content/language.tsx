import type { ReactNode } from "react";

import {  type InlineLanguage, getTextDirection} from "@/lib/content/options";

interface LanguageProps {
	children: ReactNode;
	lang: InlineLanguage;
}

export function Language(props: Readonly<LanguageProps>): ReactNode {
	const { children, lang } = props;

	return (
		<span dir={getTextDirection(lang)} lang={lang}>
			{children}
		</span>
	);
}

interface LanguageBlockProps {
	children: ReactNode;
	lang: InlineLanguage;
}

export function LanguageBlock(props: Readonly<LanguageBlockProps>): ReactNode {
	const { children, lang } = props;

	return (
		<div dir={getTextDirection(lang)} lang={lang}>
			{children}
		</div>
	);
}
