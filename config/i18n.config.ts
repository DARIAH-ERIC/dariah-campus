import type { Formats } from "next-intl";

import type metadataEn from "@/content/en/metadata/index.json";
import type en from "@/messages/en.json";

export const locales = ["en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export type IntlMessages = typeof en & { metadata: typeof metadataEn };

export interface IntlTranslations extends Record<Locale, IntlMessages> {
	en: typeof en & { metadata: typeof metadataEn };
}

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
