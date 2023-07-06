import { type ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

import { type I18n } from "@/i18n/createI18n";
import { createI18n } from "@/i18n/createI18n";
import { type Locale } from "@/i18n/i18n.config";
import { type Dictionary } from "@/i18n/loadDictionary";

export type I18nService<T> = I18n<T>;

export const I18nContext = createContext<I18nService<unknown> | null>(null);

export interface I18nProviderProps {
	/** Current locale, retrieved from `useLocale`. */
	locale: Locale;
	/**
	 * Dictionary for the current locale, should be retrieved via
	 * `@/i18n/loadDictionary` in `getStaticProps` or `getServerSideProps`,
	 * and passed to the page on the `dictionary` prop.
	 */
	dictionary: Dictionary | undefined;
	children?: ReactNode;
}

/**
 * Provides i18n service for translated UI strings, as well as
 * internationalized pluralisation rules, date and number formats.
 */
export function I18nProvider(props: I18nProviderProps): JSX.Element {
	const { locale, dictionary } = props;

	const [service, setService] = useState(() => {
		return createI18n(locale, dictionary);
	});

	useEffect(() => {
		setService(createI18n(locale, dictionary));
	}, [locale, dictionary]);

	return <I18nContext.Provider value={service}>{props.children}</I18nContext.Provider>;
}
