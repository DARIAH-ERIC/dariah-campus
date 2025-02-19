import type { IntlFormats, IntlMessages, Locale } from "@/config/i18n.config";

declare module "next-intl" {
	interface AppConfig {
		Messages: IntlMessages;
		Formats: IntlFormats;
		Locale: Locale;
	}
}
