import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { mark, wrapper } from "@keystatic/core/content-components";
import { LanguagesIcon, PilcrowLeftIcon } from "lucide-react";

import { LanguageBlockPreview } from "@/lib/content/keystatic/components/language/preview";
import { inlineLanguages } from "@/lib/content/options";

export const createLanguage = createComponent((_paths, _locale) => {
	return {
		Language: mark({
			label: "Language",
			icon: <LanguagesIcon />,
			tag: "span",
			schema: {
				lang: fields.select({
					label: "Language",
					options: inlineLanguages,
					defaultValue: "en",
				}),
			},
		}),
		LanguageBlock: wrapper({
			label: "Language block",
			description: "Insert content written in a different language.",
			icon: <PilcrowLeftIcon />,
			schema: {
				lang: fields.select({
					label: "Language",
					options: inlineLanguages,
					defaultValue: "en",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return <LanguageBlockPreview lang={value.lang}>{children}</LanguageBlockPreview>;
			},
		}),
	};
});
