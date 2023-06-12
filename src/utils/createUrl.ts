import { addQueryParams } from "@/utils/addQueryParams";

/**
 * Creates URL from path, optional base URL, and optional query parameters.
 */
export function createUrl({
	baseUrl = "https://n",
	locale,
	pathname: path,
	query,
	hash,
}: {
	baseUrl?: string;
	locale?: string;
	pathname: string;
	query?: Record<string, unknown>;
	hash?: string;
}): URL {
	const pathname =
		locale !== undefined ? [locale, path].join(path.startsWith("/") ? "" : "/") : path;

	const url = new URL(pathname, baseUrl);

	if (query !== undefined) {
		addQueryParams(url, query);
	}

	if (hash !== undefined) {
		url.hash = hash;
	}

	return url;
}
