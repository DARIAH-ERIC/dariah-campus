import { assert, log } from "@acdh-oeaw/lib";
import { Client } from "typesense";

import { env } from "@/config/env.config";
import { createDocuments } from "@/lib/typesense/create-documents";

const formatters = {
	duration: new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

const collection = env.NEXT_PUBLIC_TYPESENSE_COLLECTION;

async function seed() {
	const apiKey = env.TYPESENSE_ADMIN_API_KEY;
	assert(apiKey, "Missing TYPESENSE_ADMIN_API_KEY environment variable.");

	const start = performance.now();

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

	const documents = createDocuments();

	await client.collections(collection).documents().import(documents);

	const end = performance.now();
	const duration = formatters.duration.format(end - start);
	const stats = { duration };

	return stats;
}

seed()
	.then((stats) => {
		log.success(
			`Successfully seeded typesense collection "${collection}" in ${stats.duration} ms.`,
		);
	})
	.catch((error: unknown) => {
		log.error(`Failed to seed typesense collection "${collection}".\n`, error);
		process.exitCode = 1;
	});
