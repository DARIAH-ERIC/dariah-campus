import { assert, log } from "@acdh-oeaw/lib";
import { Client } from "typesense";
import type { KeyCreateSchema } from "typesense/lib/Typesense/Key";

import { env } from "@/config/env.config";

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

	const apiKeySchema: KeyCreateSchema = {
		actions: ["documents:export", "documents:get", "documents:search"],
		collections: [collection],
		description: `Search-only api key for "${collection}".`,
	};

	const response = await client.keys().create(apiKeySchema);

	return response.value!;
}

seed()
	.then((searchApiKey) => {
		log.success(
			`Successfully created typesense search api key "${searchApiKey}" for collection "${collection}".`,
		);
	})
	.catch((error: unknown) => {
		log.error(
			`Failed to create typesense search api key for collection "${collection}".\n`,
			String(error),
		);
		process.exitCode = 1;
	});
