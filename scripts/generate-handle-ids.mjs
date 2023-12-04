import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { createUrl, log, request } from "@acdh-oeaw/lib";
import { readSync } from "to-vfile";
import { matter } from "vfile-matter";
import YAML from "yaml";
import { z } from "zod";

const configSchema = z.object({
	resource: z
		.object({
			filePath: z.string(),
			baseUrl: z.string().url(),
		})
		.transform((value) => {
			const segments = value.filePath.split("/");
			const resourceType = segments.at(1);
			const resourceId = segments.at(2);

			if (resourceId == null) return z.NEVER;

			switch (resourceType) {
				case "courses": {
					const pathname = ["curriculum", resourceId].join("/");
					return { ...value, pathname };
				}

				case "events": {
					const pathname = ["resource", "events", , resourceId].join("/");
					return { ...value, pathname };
				}

				case "posts": {
					const pathname = ["resource", "posts", , resourceId].join("/");
					return { ...value, pathname };
				}

				default: {
					return z.NEVER;
				}
			}
		}),
	handle: z.object({
		username: z.string(),
		password: z.string(),
		provider: z.string().url(),
		prefix: z.string(),
		resolver: z.string().url(),
	}),
});

const config = configSchema.parse({
	resource: {
		baseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL,
		filePath: process.argv.at(2),
	},
	handle: {
		username: process.env.HANDLE_USERNAME,
		password: process.env.HANDLE_PASSWORD,
		provider: process.env.HANDLE_PROVIDER,
		prefix: process.env.HANDLE_PREFIX,
		resolver: process.env.HANDLE_RESOLVER,
	},
});

async function run() {
	const absoluteFilePath = join(process.cwd(), config.resource.filePath);

	const vfile = readSync(absoluteFilePath, { encoding: "utf-8" });
	matter(vfile, { strip: true });

	const metadata = /** @type {any} */ (vfile.data.matter);

	if ("handle" in metadata) {
		return Promise.resolve(false);
	}

	const resourceUrl = createUrl({
		baseUrl: config.resource.baseUrl,
		pathname: config.resource.pathname,
	});

	const { id, handle } = await createHandle(resourceUrl);

	const fileContent = [
		"---\n",
		YAML.stringify({ ...metadata, handle }),
		"---\n",
		String(vfile),
	].join("");

	await writeFileSync(absoluteFilePath, fileContent, { encoding: "utf-8" });

	return Promise.resolve(true);
}

async function createHandle(resourceUrl) {
	const url = createUrl({
		baseUrl: config.handle.provider,
		pathname: config.handle.prefix,
	});

	const body = JSON.stringify([{ type: "URL", parsed_data: String(resourceUrl) }]);

	const headers = {
		authorization:
			"Bearer " +
			Buffer.from(`${config.handle.username}:${config.handle.password}`).toString("base64"),
	};

	const response = /** @type {any} */ (
		await request(url, {
			method: "post",
			headers,
			body,
			responseType: "json",
		})
	);

	const id = response["epic-pid"];
	const handle = createUrl({ baseUrl: config.handle.resolver, pathname: id });

	return { id, handle };
}

run()
	.then((isGenerated) => {
		if (isGenerated) {
			log.success(`Generated handle id for ${config.resource.filePath}.`);
		} else {
			log.info(`Handle id already present in ${config.resource.filePath}.`);
		}
	})
	.catch((error) => {
		log.error(`Failed to generate handle id for ${config.resource.filePath}.\n`, error);
	});
