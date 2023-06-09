import {
	type GetServerSidePropsContext,
	type GetStaticPathsContext,
	type GetStaticPropsContext,
} from "next";
import { type NextRouter } from "next/router";

import { type Locale } from "@/i18n/i18n.config";

export interface LocaleBaseConfig {
	locales: Array<Locale>;
	defaultLocale: Locale;
}

export interface LocaleConfig extends LocaleBaseConfig {
	locale: Locale;
}

/**
 * Returns current i18n config.
 */
export function getLocale(
	context: GetServerSidePropsContext | GetStaticPropsContext | NextRouter,
): LocaleConfig;
export function getLocale(context: GetStaticPathsContext): LocaleBaseConfig;
export function getLocale(
	context: GetServerSidePropsContext | GetStaticPathsContext | GetStaticPropsContext | NextRouter,
): LocaleBaseConfig | LocaleConfig {
	if (!("locale" in context)) {
		return {
			locales: context.locales,
			defaultLocale: context.defaultLocale,
		} as LocaleBaseConfig;
	}

	return {
		locale: context.locale,
		locales: context.locales,
		defaultLocale: context.defaultLocale,
	} as LocaleConfig;
}
