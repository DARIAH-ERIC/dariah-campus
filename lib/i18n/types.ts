import type { IntlFormats } from "#/lib/i18n/formats.ts";
import type { IntlLocale } from "#/lib/i18n/locales.ts";
import type { IntlMessages } from "#/lib/i18n/messages.ts";

declare module "next-intl" {
	interface AppConfig {
		Formats: IntlFormats;
		Locale: IntlLocale;
		Messages: IntlMessages;
	}
}
