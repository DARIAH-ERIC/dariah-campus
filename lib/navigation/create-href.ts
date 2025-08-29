import { env } from "@/config/env.config";
import { createFullUrl, type CreateFullUrlParams } from "@/lib/navigation/create-full-url";

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

export function createHref(href: CreateFullUrlParams): string {
	const url = createFullUrl(href);

	if (url.origin === baseUrl) {
		if (href.pathname == null && (href.searchParams != null || href.hash != null)) {
			return url.search + url.hash;
		}

		return String(url).slice(baseUrl.length);
	}

	return String(url);
}
