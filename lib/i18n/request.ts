import { getRequestConfig } from "next-intl/server";

import { formats } from "@/lib/i18n/formats";
import { defaultLocale, timeZone } from "@/lib/i18n/locales";
import { getIntlMessages } from "@/lib/i18n/messages";

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
