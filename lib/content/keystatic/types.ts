import type { IntlLanguage } from "@/lib/i18n/locales";

declare module "@acdh-oeaw/keystatic-lib" {
	export interface KeystaticConfig {
		locales: IntlLanguage;
	}
}
