import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import type { Locale } from "@/config/i18n.config";

export function createImprintUrl(locale: Locale): URL {
	return createUrl({
		baseUrl: "https://imprint.acdh.oeaw.ac.at",
		pathname: `/${String(env.NEXT_PUBLIC_REDMINE_ID)}`,
		searchParams: createUrlSearchParams({ locale }),
	});
}
