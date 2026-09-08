import type { Timezone } from "next-intl";

export const locales = ["en-GB"] as const;

export const defaultLocale: (typeof locales)[number] = "en-GB";

export const timeZone: Timezone = "UTC";
