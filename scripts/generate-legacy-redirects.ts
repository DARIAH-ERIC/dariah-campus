import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { assert, log } from "@acdh-oeaw/lib";
import slugify from "@sindresorhus/slugify";

import { curricula } from "@/public/metadata/legacy/curricula.json";
import { events } from "@/public/metadata/legacy/events.json";
import { resources } from "@/public/metadata/legacy/resources.json";

async function generate() {
	const redirects: Array<{ source: string; destination: string; permanent: true }> = [];

	const _curriculaFolder = join(process.cwd(), "content", "en", "curricula");
	const _curricula = new Set(await readdir(_curriculaFolder));

	curricula.forEach((curriculum) => {
		const id = slugify(curriculum.id);

		assert(_curricula.has(id), `Unknown curriculum "${id}".`);

		redirects.push({
			source: `/curriculum/${curriculum.id}`,
			destination: `/curricula/${id}`,
			permanent: true,
		});
	});

	//

	const _eventsFolder = join(process.cwd(), "content", "en", "resources", "events");
	const _events = new Set(await readdir(_eventsFolder));

	events.forEach((event) => {
		const id = slugify(event.id);

		assert(_events.has(id), `Unknown event "${id}".`);

		redirects.push({
			source: `/resource/events/${event.id}`,
			destination: `/resources/events/${id}`,
			permanent: true,
		});
	});

	//

	const _externalResourcesFolder = join(process.cwd(), "content", "en", "resources", "external");
	const __externalResources = new Set(await readdir(_externalResourcesFolder));
	const _hostedResourcesFolder = join(process.cwd(), "content", "en", "resources", "hosted");
	const _hostedResources = new Set(await readdir(_hostedResourcesFolder));
	const _pathfindersResourcesFolder = join(
		process.cwd(),
		"content",
		"en",
		"resources",
		"pathfinders",
	);
	const _pathfindersResources = new Set(await readdir(_pathfindersResourcesFolder));

	resources.forEach((resource) => {
		const id = slugify(resource.id);

		const kind = __externalResources.has(id)
			? "external"
			: _hostedResources.has(id)
				? "hosted"
				: _pathfindersResources.has(id)
					? "pathfinders"
					: null;

		assert(kind, `Unknown resource kind for resource "${id}".`);

		redirects.push({
			source: `/resource/posts/${resource.id}`,
			destination: `/resources/${kind}/${id}`,
			permanent: true,
		});
	});

	//

	const outputFilePath = join(process.cwd(), "public", "redirects.json");

	await writeFile(outputFilePath, JSON.stringify({ redirects }), { encoding: "utf-8" });
}

generate()
	.then(() => {
		log.success("Successfully created redirects for legacy resources.");
	})
	.catch((error: unknown) => {
		log.error("Failed to create redirects for legacy resources.\n", String(error));
		process.exitCode = 1;
	});
