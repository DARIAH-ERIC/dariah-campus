import { assert, log } from "@acdh-oeaw/lib";
import { Client } from "typesense";

import { env } from "@/config/env.config";
import { defaultLocale } from "@/config/i18n.config";
import { createDocuments } from "@/lib/typesense/create-documents";

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
	const documents = await createDocuments(locale);

	await client.collections(collection).documents().import(documents);
}

seed()
	.then(() => {
		log.success(`Successfully seeded typesense collection "${collection}".`);
	})
	.catch((error: unknown) => {
		log.error(`Failed to seed typesense collection "${collection}".\n`, String(error));
		process.exitCode = 1;
	});
