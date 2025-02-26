import type { Language, Locale } from "@/config/i18n.config";

export function getLanguage(locale: Locale): Language {
	const language = new Intl.Locale(locale).language as Language;

	return language;
}
