import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";

import { log } from "@acdh-oeaw/lib";
import sharp from "sharp";
import * as v from "valibot";

const positionalArgsSchema = v.optional(v.picklist(["create", "remove"]), "create");

const root = join(import.meta.dirname, "..", "..");

/**
 * The e2e suite drives the content widgets through the whole pipeline - mdx, the remark and rehype plugins, the content
 * collection, and the rendered page - so its fixtures have to be real content, compiled by `content:build` like
 * everything else.
 *
 * They are copied in from `e2e/fixtures/resources/` instead of living in the content collection, and the copies are
 * gitignored, so a real deployment never builds them: there is no branch to gate, the files are simply not there. Note
 * that this means the fixtures _are_ part of the search index and the metadata dump of a build which has them.
 */
const sourceDirectory = join(root, "e2e", "fixtures", "resources");
const targetDirectory = join(root, "content", "en", "resources", "hosted");
const assetsDirectory = join(root, "public", "assets", "content", "assets", "en", "resources", "hosted");

/**
 * The image widgets need real files: the `with-image-sizes` rehype plugin reads their dimensions off disk at build
 * time. They are generated rather than committed, because nothing about them matters except that they are distinct, and
 * that keeps binaries out of the repository.
 */
const images = [
	{ name: "layer-1.png", background: { r: 205, g: 226, b: 245 } },
	{ name: "layer-2.png", background: { r: 129, g: 178, b: 224 } },
	{ name: "layer-3.png", background: { r: 27, g: 94, b: 154 } },
	{ name: "annotated.png", background: { r: 240, g: 233, b: 214 } },
];

const imageSize = { height: 360, width: 640 };

async function createImages(id: string): Promise<void> {
	const directory = join(assetsDirectory, id);

	await mkdir(directory, { recursive: true });

	for (const { background, name } of images) {
		const image = await sharp({ create: { ...imageSize, background, channels: 3 } })
			.png()
			.toBuffer();

		await writeFile(join(directory, name), image);
	}
}

async function getFixtureIds(): Promise<Array<string>> {
	const entries = await readdir(sourceDirectory, { withFileTypes: true });

	return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function create(): Promise<void> {
	const ids = await getFixtureIds();

	for (const id of ids) {
		await cp(join(sourceDirectory, id), join(targetDirectory, id), { force: true, recursive: true });
		await createImages(id);
	}

	log.success(`Created ${String(ids.length)} e2e fixture resource${ids.length === 1 ? "" : "s"}: ${ids.join(", ")}.`);
}

async function remove(): Promise<void> {
	const ids = await getFixtureIds();

	for (const id of ids) {
		await rm(join(targetDirectory, id), { force: true, recursive: true });
		await rm(join(assetsDirectory, id), { force: true, recursive: true });
	}

	log.success(`Removed ${String(ids.length)} e2e fixture resource${ids.length === 1 ? "" : "s"}: ${ids.join(", ")}.`);
}

async function run(): Promise<void> {
	const { positionals } = parseArgs({ allowPositionals: true });
	const mode = v.parse(positionalArgsSchema, positionals.at(0));

	switch (mode) {
		case "create": {
			await create();
			break;
		}

		case "remove": {
			await remove();
			break;
		}
	}
}

run().catch((error: unknown) => {
	log.error("Failed to update e2e fixture content.\n", error);
	process.exitCode = 1;
});
