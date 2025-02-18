import { assert, log } from "@acdh-oeaw/lib";
import { Client, Errors } from "typesense";

import { env } from "@/config/env.config";
import { defaultLocale } from "@/config/i18n.config";
import { createDocuments } from "@/lib/typesense/create-documents";
import { schema } from "@/lib/typesense/schema";

const collection = schema.name;

export async function create() {
	// eslint-disable-next-line no-restricted-syntax
	const isProductionEnvironment = process.env.VERCEL_ENV === "production";
	// eslint-disable-next-line no-restricted-syntax
	const isMainBranch = process.env.VERCEL_GIT_COMMIT_REF === "main";

	if (!isProductionEnvironment || !isMainBranch) {
		return false;
	}

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

	try {
		await client.collections(collection).delete();
	} catch (error) {
		if (!(error instanceof Errors.ObjectNotFound)) {
			throw error;
		}
	}

	await client.collections().create(schema);

	const locale = defaultLocale;
	const documents = await createDocuments(locale);

	await client.collections(collection).documents().import(documents);

	return true;
}

create()
	.then((isSuccessful) => {
		if (isSuccessful) {
			log.success(`Successfully updated typesense collection "${collection}".`);
		} else {
			log.info(`Skipped updating typesense collection "${collection}".`);
		}
	})
	.catch((error: unknown) => {
		log.error(`Failed to update typesense collection "${collection}".\n`, String(error));
		process.exitCode = 1;
	});
