import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";

import { assert, createUrl, log } from "@acdh-oeaw/lib";
import { read } from "to-vfile";
import { v7 as uuid } from "uuid";
import * as v from "valibot";
import { matter } from "vfile-matter";
import * as YAML from "yaml";

import { env } from "@/config/env.config";

function createResourceUrl(path: string): URL {
	const message = "Invalid resource path.";

	assert(path.endsWith("/index.mdx"), message);

	const segments = path.split("/");

	const id = segments.at(-2)!;
	assert(id, message);

	const collection = segments.at(-3);
	assert(collection, message);

	if (collection === "curricula") {
		return createUrl({
			baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
			pathname: `/curricula/${id}`,
		});
	}

	const kind = segments.at(-4);
	assert(kind, message);

	if (kind === "resources") {
		return createUrl({
			baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
			pathname: `/resources/${collection}/${id}`,
		});
	}

	assert(false, message);
}

const ArgsInputSchema = v.object({
	resource: v.pipe(v.string(), v.nonEmpty()),
});

async function create() {
	const isProductionEnvironment = env.VERCEL_ENV === "production";
	const isMainBranch = env.VERCEL_GIT_COMMIT_REF === "main";

	if (!isProductionEnvironment || !isMainBranch) {
		return null;
	}

	// eslint-disable-next-line no-restricted-syntax
	if (process.env.HANDLE_SERVICE !== "enabled") {
		log.info("Handle service disabled.");
		return null;
	}

	const args = parseArgs({ options: { resource: { type: "string", short: "r" } } });
	const { resource: path } = v.parse(ArgsInputSchema, args.values);

	const _url = createResourceUrl(path);

	const absoluteFilePath = join(process.cwd(), path);
	const vfile = await read(absoluteFilePath, { encoding: "utf-8" });
	matter(vfile, { strip: true });
	const metadata = vfile.data.matter as { doi?: string };

	if (metadata.doi) {
		return null;
	}

	// const body = JSON.stringify([{ type: "URL", parsed_data: String(url) }]);

	// const headers = {
	// 	authorization: `Bearer ${Buffer.from(`${username}:${password}`).toString("base64")}`,
	// };

	// const response = (await request(createUrl({ baseUrl: provider, pathname: prefix }), {
	// 	method: "post",
	// 	headers,
	// 	body,
	// 	responseType: "json",
	// })) as { "epic-pid": string };

	// const handle = createUrl({ baseUrl: resolver, pathname: response["epic-pid"] });

	const handle = uuid();

	await writeFile(
		absoluteFilePath,
		["---\n", YAML.stringify({ ...metadata, doi: String(handle) }), "---\n", String(vfile)],
		{ encoding: "utf-8" },
	);

	return handle;
}

create()
	.then((handle) => {
		if (handle != null) {
			log.success(`Successfully created handle "${handle}".`);
		} else {
			log.info("Skipped creating handle.");
		}
	})
	.catch((error: unknown) => {
		log.error("Failed to create handle.\n", String(error));
		process.exitCode = 1;
	});
