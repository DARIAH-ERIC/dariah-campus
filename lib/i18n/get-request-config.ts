import "server-only";

import { getRequestConfig } from "next-intl/server";

import { defaultLocale, formats } from "@/config/i18n.config";
import { getI18nMessages } from "@/lib/i18n/get-messages";

export default getRequestConfig(async () => {
	const locale = defaultLocale;

	const timeZone = "UTC";
	const messages = await getI18nMessages(locale);

	return {
		formats,
		locale,
		messages,
		timeZone,
	};
});
