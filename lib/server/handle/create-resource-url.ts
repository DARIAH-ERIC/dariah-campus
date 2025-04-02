import { assert, createUrl } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";

export function createResourceUrl(path: string): URL {
	const message = "Invalid resource path.";

	assert(path.endsWith("/index.mdx"), message);

	const segments = path.split("/");

	const id = segments.at(-2)!;
	assert(id, message);

	const collection = segments.at(-3);
	assert(collection, message);

	if (collection === "curricula") {
		return createUrl({
			baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
			pathname: `/curricula/${id}`,
		});
	}

	const kind = segments.at(-4);
	assert(kind, message);

	if (kind === "resources") {
		return createUrl({
			baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
			pathname: `/resources/${collection}/${id}`,
		});
	}

	assert(false, message);
}
