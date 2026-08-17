import type { IntlLanguage } from "#/lib/i18n/locales.ts";

declare module "@acdh-oeaw/keystatic-lib" {
  export interface KeystaticConfig {
    locales: IntlLanguage;
  }
}
