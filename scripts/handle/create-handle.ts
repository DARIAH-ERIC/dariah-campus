import { glob, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";

import { log } from "@acdh-oeaw/lib";
import { read } from "to-vfile";
import * as v from "valibot";
import { matter } from "vfile-matter";
import * as YAML from "yaml";

import { createHandle } from "#/lib/server/handle/create-handle.ts";
import { createResourceUrl } from "#/lib/server/handle/create-resource-url.ts";

/**
 * Mints a handle for every resource and curriculum without a `doi`. This only runs in the "Mint handles" github
 * workflow, which never runs concurrently with itself: minting must not be moved back into the build, because
 * concurrent builds mint duplicate handles.
 */

const ArgsInputSchema = v.object({
	/** Path to a file listing resources to skip, one per line. */
	exclude: v.optional(v.pipe(v.string(), v.nonEmpty())),
});

const patterns = ["content/*/curricula/*/index.mdx", "content/*/resources/*/*/index.mdx"];

async function createResourceHandle(path: string) {
	const absoluteFilePath = join(process.cwd(), path);
	const vfile = await read(absoluteFilePath, { encoding: "utf-8" });
	matter(vfile, { strip: true });
	const metadata = vfile.data.matter as { doi?: string };

	// oxlint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (metadata.doi) {
		return null;
	}

	const resourceUrl = createResourceUrl(path);
	const handle = await createHandle(resourceUrl);

	await writeFile(
		absoluteFilePath,
		["---\n", YAML.stringify({ ...metadata, doi: String(handle) }), "---\n", String(vfile)],
		{ encoding: "utf-8" },
	);

	return handle;
}

async function create() {
	const args = parseArgs({ options: { exclude: { type: "string", short: "e" } } });
	const { exclude } = v.parse(ArgsInputSchema, args.values);

	const excluded = new Set(exclude != null ? (await readFile(exclude, { encoding: "utf-8" })).split("\n") : []);

	for await (const path of glob(patterns)) {
		/** External resources are hosted elsewhere and must not be assigned a handle. */
		if (/[/\\]resources[/\\]external[/\\]/.test(path)) {
			continue;
		}

		if (excluded.has(path)) {
			log.info(`Skipping "${path}", a pull request with its handle is already open.`);
			continue;
		}

		const handle = await createResourceHandle(path);

		if (handle != null) {
			log.success(`Successfully created handle "${String(handle)}" for "${path}".`);
		}
	}
}

create().catch((error: unknown) => {
	log.error("Failed to create handles.\n", error);
	process.exitCode = 1;
});
