import {
	type CreateUrlParams,
	type CreateUrlSearchParamsParams,
	createUrl,
	createUrlSearchParams,
} from "@acdh-oeaw/lib";

import { env } from "#/configs/env.config.ts";

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
