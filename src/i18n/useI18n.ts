import { useContext } from "react";

import { MissingContextProviderError } from "@/error/MissingContextProviderError";
import { type I18nService } from "@/i18n/I18n.context";
import { I18nContext } from "@/i18n/I18n.context";

/**
 * Provides i18n service for translated UI strings, as well as
 * internationalized pluralisation rules, date and number formats.
 */
export function useI18n(): I18nService<unknown> {
	const i18n = useContext(I18nContext);

	if (i18n === null) {
		throw new MissingContextProviderError("useI18n", "I18nProvider");
	}

	return i18n;
}
