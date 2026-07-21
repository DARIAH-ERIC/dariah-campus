import { assert, log } from "@acdh-oeaw/lib";
import { Client } from "typesense";

import { env } from "@/config/env.config";
import { createDocuments } from "@/lib/typesense/create-documents";
import { schema } from "@/lib/typesense/schema";

const formatters = {
	duration: new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

const collection = schema.name;

async function create() {
	const isProductionEnvironment = env.VERCEL_ENV === "production";
	const isMainBranch = env.VERCEL_GIT_COMMIT_REF === "main";

	if (!isProductionEnvironment || !isMainBranch) {
		return false;
	}

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

	if (await client.collections(collection).exists()) {
		await client.collections(collection).documents().delete({ truncate: true });
	} else {
		await client.collections().create(schema);
	}

	const documents = await createDocuments();

	await client.collections(collection).documents().import(documents);

	const end = performance.now();
	const duration = formatters.duration.format(end - start);
	const stats = { duration };

	return stats;
}

create()
	.then((stats) => {
		if (stats === false) {
			log.info(`Skipped updating typesense collection "${collection}".`);
		} else {
			log.success(
				`Successfully updated typesense collection "${collection}" in ${stats.duration} ms.`,
			);
		}
	})
	.catch((error: unknown) => {
		log.error(`Failed to update typesense collection "${collection}".\n`, error);
		process.exitCode = 1;
	});
