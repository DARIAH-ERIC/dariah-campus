import { join } from "node:path";

import { glob } from "fast-glob";
import type { MetadataRoute } from "next";

import { createResourceUrl } from "@/app/(app)/resources/_lib/create-resource-url";
import { defaultLocale } from "@/config/i18n.config";
import { createClient } from "@/lib/content/create-client";
import { createFullUrl } from "@/lib/create-full-url";

const locale = defaultLocale;

/**
 * Google supports up to 50.000 entries per sitemap file. Apps which need more that that can use
 * `generateSitemaps` to generate multiple sitemap files.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const paths = await glob("./**/page.tsx", { cwd: join(process.cwd(), "app", "(app)") });

	const routes: Array<string> = [];

	paths.forEach((path) => {
		const route = path.slice(0, -"/page.tsx".length);

		if (route === "[...notfound]") return;

		const segments = [];

		for (const segment of route.split("/")) {
			/** Dynamic routes. */
			if (segment.startsWith("[") && segment.endsWith("]")) return;

			/** Route groups. */
			if (segment.startsWith("(") && segment.endsWith(")")) continue;

			segments.push(segment);
		}

		routes.push(segments.join("/"));
	});

	const client = await createClient(locale);

	const resources = await client.resources.all();
	const curricula = await client.curricula.all();
	const sources = await client.sources.all();
	const docs = await client.documentation.all();

	resources.forEach((resource) => {
		routes.push(createResourceUrl(resource));
	});
	curricula.forEach((curriculum) => {
		routes.push(`/curricula/${curriculum.id}`);
	});
	sources.forEach((source) => {
		routes.push(`/sources/${source.id}`);
	});
	docs.forEach((page) => {
		routes.push(`/documentation/${page.id}`);
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
