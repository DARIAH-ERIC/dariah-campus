import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { log } from "@acdh-oeaw/lib";

import { defaultLocale } from "@/config/i18n.config";
import { createMetadata } from "@/lib/metadata/create-metadata-dump";

/**
 * We dump resource metadata to the public folder, and use it in api routes,
 * because at runtime, the `content` folder is not available because we explicitly
 * omit it from the deployment via `next.config.ts#outputFileTracingExcludes` (which
 * we set to avoid going over vercel's function size limit of 250mb).
 */
async function dump() {
	const { curricula, resources } = await createMetadata(defaultLocale);

	const outputFolder = join(process.cwd(), "public", "metadata");

	await writeFile(join(outputFolder, "curricula.json"), JSON.stringify(curricula), {
		encoding: "utf-8",
	});
	await writeFile(join(outputFolder, "resources.json"), JSON.stringify(resources), {
		encoding: "utf-8",
	});
}

dump()
	.then(() => {
		log.success("Successfully dumped metadata.");
	})
	.catch((error: unknown) => {
		log.error("Failed to dump metadata.\n", String(error));
		process.exitCode = 1;
	});
