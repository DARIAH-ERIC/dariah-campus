import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { assert, log } from "@acdh-oeaw/lib";
import { createReader } from "@keystatic/core/reader";
import { Client } from "typesense";

import { env } from "@/config/env.config";
import { defaultLocale } from "@/config/i18n.config";
import config from "@/keystatic.config";

const collection = env.NEXT_PUBLIC_TYPESENSE_COLLECTION;

async function seed() {
	const apiKey = env.TYPESENSE_ADMIN_API_KEY;
	assert(apiKey, "Missing TYPESENSE_ADMIN_API_KEY environment variable.");

	const client = new Client({
		apiKey,
		connectionTimeoutSeconds: 3,
		nodes: [
			{
				host: env.NEXT_PUBLIC_TYPESENSE_HOST,
				port: env.NEXT_PUBLIC_TYPESENSE_PORT,
				protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
			},
		],
	});

	await client
		.collections(collection)
		.documents()
		.delete({ filter_by: "", ignore_not_found: true });

	const locale = defaultLocale;
	const reader = createReader(process.cwd(), config);

	const collections = [
		"resources-events",
		"resources-external",
		"resources-hosted",
		"resources-pathfinders",
		"curricula",
	] as const;

	for (const name of collections) {
		const items = await reader.collections[withI18nPrefix(name, locale)].all();

		if (items.length === 0) continue;

		const documents = items.map((item) => {
			return {
				id: item.slug,
				collection: name,
				title: item.entry.summary.title || item.entry.title,
				locale: item.entry.locale,
				"publication-date": item.entry["publication-date"],
				"publication-timestamp": new Date(item.entry["publication-date"]).getTime(),
				"content-type":
					"content-type" in item.entry
						? item.entry["content-type"]
						: name === "curricula"
							? "curriculum"
							: name === "resources-events"
								? "event"
								: "pathfinder",
				summary: item.entry.summary.content,
				"summary-title": item.entry.summary.title,
				tags: item.entry.tags,
				people: "authors" in item.entry ? item.entry.authors : item.entry.editors,
				sources: "sources" in item.entry ? item.entry.sources : [],
			};
		});

		await client.collections(collection).documents().import(documents);
	}
}

seed()
	.then(() => {
		log.success(`Successfully seeded typesense collection "${collection}".`);
	})
	.catch((error: unknown) => {
		log.error(`Failed to seed typesense collection "${collection}".\n`, String(error));
		process.exitCode = 1;
	});
