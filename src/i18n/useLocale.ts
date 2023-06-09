import { useRouter } from "next/router";
import { useMemo } from "react";

import { type LocaleConfig } from "@/i18n/getLocale";
import { getLocale } from "@/i18n/getLocale";
import { type Locale } from "@/i18n/i18n.config";

/**
 * Returns current i18n config.
 */
export function useLocale(): LocaleConfig & {
	setLocale: (locale: Locale) => void;
} {
	const router = useRouter();

	return useMemo(() => {
		return {
			...getLocale(router),
			setLocale(locale: Locale) {
				router.push(router.asPath, undefined, { locale });
			},
		};
	}, [router]);
}
