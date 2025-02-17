import { createUrl } from "@acdh-oeaw/lib";
import { getTranslations } from "next-intl/server";
// import { renderToStaticMarkup } from "react-dom/server";
import { type Entry, rss } from "xast-util-feed";
import { toXml } from "xast-util-to-xml";

import { env } from "@/config/env.config";
import type { Locale } from "@/config/i18n.config";

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

export async function createFeed(locale: Locale) {
	const meta = await getTranslations({ locale, namespace: "metadata" });

	const channel = {
		title: meta("title"),
		url: baseUrl,
		feedUrl: String(createUrl({ baseUrl, pathname: `/${locale}/rss.xml` })),
		lang: locale,
	};

	const entries: Array<Entry> = [];

	const feed = toXml(rss(channel, entries));

	return feed;
}
