import { log } from "@acdh-oeaw/lib";

import { env } from "#/configs/env.config.ts";
import { createSearchAdminService } from "#/lib/search/admin.ts";
import { createDocuments } from "#/lib/search/create-documents.ts";

const admin = createSearchAdminService({
	apiKey: env.TYPESENSE_ADMIN_API_KEY,
	nodes: [
		{
			host: env.NEXT_PUBLIC_TYPESENSE_HOST,
			port: env.NEXT_PUBLIC_TYPESENSE_PORT,
			protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
		},
	],
	collections: {
		resources: env.NEXT_PUBLIC_TYPESENSE_COLLECTION,
	},
});

async function main() {
	const isProductionEnvironment = env.VERCEL_ENV === "production";
	const isMainBranch = env.VERCEL_GIT_COMMIT_REF === "main";

	if (!isProductionEnvironment || !isMainBranch) {
		log.info(`Skipped updating collection "${env.NEXT_PUBLIC_TYPESENSE_COLLECTION}".`);
		return;
	}

	(await admin.collections.resources.create()).unwrap();
	(await admin.collections.resources.truncate()).unwrap();

	const documents = await createDocuments();

	(await admin.collections.resources.ingest(documents)).unwrap();

	log.success(`Successfully updated collection "${env.NEXT_PUBLIC_TYPESENSE_COLLECTION}".`);
}

main().catch((error: unknown) => {
	log.error("Failed to update collections.\n", error);
	process.exitCode = 1;
});
