import type { IntlFormats } from "@/lib/i18n/formats";
import type { IntlLocale } from "@/lib/i18n/locales";
import type { IntlMessages } from "@/lib/i18n/messages";

declare module "next-intl" {
	interface AppConfig {
		Formats: IntlFormats;
		Locale: IntlLocale;
		Messages: IntlMessages;
	}
}
