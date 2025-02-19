import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";

import { assert, createUrl, log, request } from "@acdh-oeaw/lib";
import { read } from "to-vfile";
import * as v from "valibot";
import { matter } from "vfile-matter";
import * as YAML from "yaml";

import { env } from "@/config/env.config";

const ArgsInputSchema = v.object({
	resource: v.pipe(v.string(), v.nonEmpty()),
});

async function create() {
	const isProductionEnvironment = env.VERCEL_ENV === "production";
	const isMainBranch = env.VERCEL_GIT_COMMIT_REF === "main";

	if (!isProductionEnvironment || !isMainBranch) {
		return false;
	}

	assert(env.HANDLE_PROVIDER, `Missing "HANDLE_PROVIDER" environment variable.`);
	assert(env.HANDLE_PREFIX, `Missing "HANDLE_PREFIX" environment variable.`);
	assert(env.HANDLE_RESOLVER, `Missing "HANDLE_RESOLVER" environment variable.`);
	assert(env.HANDLE_USERNAME, `Missing "HANDLE_USERNAME" environment variable.`);
	assert(env.HANDLE_PASSWORD, `Missing "HANDLE_PASSWORD" environment variable.`);

	const provider = env.HANDLE_PROVIDER;
	const prefix = env.HANDLE_PREFIX;
	const resolver = env.HANDLE_RESOLVER;
	const username = env.HANDLE_USERNAME;
	const password = env.HANDLE_PASSWORD;

	const args = parseArgs({ options: { resource: { type: "string", short: "r" } } });

	const { resource } = v.parse(ArgsInputSchema, args.values);

	if (!resource.endsWith("/index.mdx")) {
		return false;
	}

	const id = resource.split("/").at(-2)!;

	if (!id) {
		return false;
	}

	const absoluteFilePath = join(process.cwd(), resource);
	const vfile = await read(absoluteFilePath, { encoding: "utf-8" });
	matter(vfile, { strip: true });
	const metadata = vfile.data.matter as { doi?: string };

	if (metadata.doi) {
		return false;
	}

	const resourceUrl = createUrl({
		baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
		pathname: `/resources/${id}`,
	});

	const body = JSON.stringify([{ type: "URL", parsed_data: String(resourceUrl) }]);

	const headers = {
		authorization: `Bearer ${Buffer.from(`${username}:${password}`).toString("base64")}`,
	};

	const response = (await request(createUrl({ baseUrl: provider, pathname: prefix }), {
		method: "post",
		headers,
		body,
		responseType: "json",
	})) as { "epic-pid": string };

	const doi = createUrl({ baseUrl: resolver, pathname: response["epic-pid"] });

	await writeFile(
		absoluteFilePath,
		["---\n", YAML.stringify({ ...metadata, doi: String(doi) }), "---\n", String(vfile)],
		{ encoding: "utf-8" },
	);

	return true;
}

create()
	.then((isSuccessful) => {
		if (isSuccessful) {
			log.success("Successfully created DOIs.");
		} else {
			log.info("Skipped creating DOIs.");
		}
	})
	.catch((error: unknown) => {
		log.error("Failed to create DOIs.\n", String(error));
		process.exitCode = 1;
	});
