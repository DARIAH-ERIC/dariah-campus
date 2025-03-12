import type { Formats } from "next-intl";

import type { I18nMessages } from "@/lib/i18n/get-messages";

export type IntlMessages = I18nMessages;

export const locales = ["en-GB"] as const;

export type Locale = (typeof locales)[number];

export type Language = Locale extends `${infer L}-${string}` ? L : Locale;

export const defaultLocale: Locale = "en-GB";

export const formats = {
	dateTime: {
		long: {
			dateStyle: "long",
		},
	},
	list: {
		enumeration: {
			style: "long",
			type: "conjunction",
		},
	},
} satisfies Formats;

export type IntlFormats = typeof formats;
