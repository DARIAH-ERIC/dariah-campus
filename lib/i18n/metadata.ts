import { useMessages } from "next-intl";
import { getMessages } from "next-intl/server";

import type { IntlLocale } from "#/lib/i18n/locales.ts";
import type { IntlMessages } from "#/lib/i18n/messages.ts";

export async function getMetadata(locale?: IntlLocale): Promise<IntlMessages["metadata"]> {
	const { metadata } = await getMessages({ locale });

	return metadata;
}

export function useMetadata(): IntlMessages["metadata"] {
	const { metadata } = useMessages();

	return metadata;
}
