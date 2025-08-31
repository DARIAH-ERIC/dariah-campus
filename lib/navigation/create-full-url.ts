import {
	createUrl,
	type CreateUrlParams,
	createUrlSearchParams,
	type CreateUrlSearchParamsParams,
} from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";

export interface CreateFullUrlParams extends Omit<CreateUrlParams, "baseUrl" | "searchParams"> {
	baseUrl?: CreateUrlParams["baseUrl"];
	searchParams?: CreateUrlSearchParamsParams;
}

export function createFullUrl(params: CreateFullUrlParams): URL {
	const { baseUrl = env.NEXT_PUBLIC_APP_BASE_URL, pathname, searchParams, hash } = params;

	return createUrl({
		baseUrl,
		pathname,
		searchParams:
			searchParams != null
				? searchParams instanceof URLSearchParams
					? searchParams
					: createUrlSearchParams(searchParams)
				: undefined,
		hash,
	});
}
