import { glob } from "node:fs/promises";
import { join } from "node:path";

import type { MetadataRoute } from "next";

import { client } from "@/lib/content/client";
import { createFullUrl } from "@/lib/navigation/create-full-url";

/**
 * Google supports up to 50.000 entries per sitemap file. Apps which need more than that can use
 * `generateSitemaps` to generate multiple sitemap files.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const routes: Array<string> = [];

	for await (const path of glob("./**/page.tsx", {
		cwd: join(process.cwd(), "app", "(app)"),
	})) {
		const route = path.slice(0, -"/page.tsx".length);

		const segments = [];

		for (const segment of route.split("/")) {
			/** Dynamic routes. */
			if (segment.startsWith("[") && segment.endsWith("]")) {
				break;
			}

			/** Route groups. */
			if (segment.startsWith("(") && segment.endsWith(")")) {
				continue;
			}

			segments.push(segment);
		}

		routes.push(`/${segments.join("/")}`);
	}

	client.collections.resources.all().forEach((resource) => {
		routes.push(resource.href);
	});
	client.collections.curricula.all().forEach((curriculum) => {
		routes.push(curriculum.href);
	});
	client.collections.sources.all().forEach((source) => {
		routes.push(source.href);
	});
	client.collections.documentation.all().forEach((page) => {
		routes.push(page.href);
	});

	const entries = routes.map((pathname) => {
		return {
			url: String(createFullUrl({ pathname })),
			/**
			 * Only add `lastmod` when the publication date is actually known.
			 * Don't use the build date instead.
			 */
			// lastModified: new Date(),
		};
	});

	return entries;
}
