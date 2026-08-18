import { log } from "@acdh-oeaw/lib";

import { env } from "#/configs/env.config.ts";
import { createSearchAdminService } from "#/lib/search/admin.ts";

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
	(await admin.collections.resources.create()).unwrap();
	log.success(`Successfully created collection "${env.NEXT_PUBLIC_TYPESENSE_COLLECTION}".`);
}

main().catch((error: unknown) => {
	log.error("Failed to create collections.\n", error);
	process.exitCode = 1;
});
