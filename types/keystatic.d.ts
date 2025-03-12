import type { Language } from "@/config/i18n.config";

declare module "@acdh-oeaw/keystatic-lib" {
	export interface KeystaticConfig {
		locales: Language;
	}
}
