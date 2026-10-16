import { getRequestConfig } from "next-intl/server";

import { formats } from "#/lib/i18n/formats.ts";
import { defaultLocale, timeZone } from "#/lib/i18n/locales.ts";
import { getIntlMessages } from "#/lib/i18n/messages.ts";

// oxlint-disable-next-line import/no-default-export
export default getRequestConfig(async () => {
	const locale = defaultLocale;
	const messages = await getIntlMessages(locale);

	return {
		formats,
		locale,
		messages,
		timeZone,
	};
});
