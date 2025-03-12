import { getMessages } from "next-intl/server";

import type { Locale } from "@/config/i18n.config";

export async function getMetadata(locale?: Locale) {
	const { metadata } = await getMessages({ locale });

	return metadata;
}
