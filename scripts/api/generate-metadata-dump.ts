import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { assert, log } from "@acdh-oeaw/lib";

import { client } from "@/lib/content/client";
import type { CurriculumMetadata } from "@/public/metadata/curricula.json";
import type { ResourceMetadata } from "@/public/metadata/resources.json";

const formatters = {
	duration: new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

export async function createMetadata(): Promise<{
	curricula: Array<CurriculumMetadata>;
	resources: Array<ResourceMetadata>;
}> {
	async function createPerson(id: string) {
		const person = await client.collections.people.get(id);
		assert(person, `Missing person "${id}".`);
		const { name, social } = person.metadata;
		const orcid =
			social.find((s) => {
				return s.discriminant === "orcid";
			})?.value ?? null;
		return { id, name, orcid };
	}

	async function createSource(id: string) {
		const source = await client.collections.sources.get(id);
		assert(source, `Missing source "${id}".`);
		const { name } = source.metadata;
		return { id, name };
	}

	async function createTag(id: string) {
		const tag = await client.collections.tags.get(id);
		assert(tag, `Missing tag "${id}".`);
		const { name } = tag.metadata;
		return { id, name };
	}

	const curricula: Array<CurriculumMetadata> = [];
	const resources: Array<ResourceMetadata> = [];

	await Promise.all(
		(await client.collections.curricula.all()).map(async (item) => {
			const isDraft = "draft" in item.metadata && item.metadata.draft === true;
			if (isDraft) return;

			curricula.push({
				id: item.id,
				collection: "curriculum",
				version: item.metadata.version,
				pid: item.metadata.doi,
				title: item.metadata.title,
				summary: item.metadata.summary,
				license: item.metadata.license,
				locale: item.metadata.locale,
				translations: item.metadata.translations,
				"publication-date": item.metadata["publication-date"],
				"content-type": "curriculum",
				tags: await Promise.all(item.metadata.tags.map(createTag)),
				editors:
					"editors" in item.metadata
						? await Promise.all(item.metadata.editors.map(createPerson))
						: [],
				resources: item.metadata.resources.map((resource) => {
					return { id: resource.value, collection: resource.discriminant };
				}),
			});
		}),
	);

	/** Resources. */

	for (const [name, kind] of [
		["resourcesEvents", "event"],
		["resourcesExternal", "external"],
		["resourcesHosted", "hosted"],
		["resourcesPathfinders", "pathfinder"],
	] as const) {
		await Promise.all(
			(await client.collections[name].all()).map(async (item) => {
				const isDraft = "draft" in item.metadata && item.metadata.draft === true;
				if (isDraft) return;

				resources.push({
					id: item.id,
					collection: name,
					kind,
					version: item.metadata.version,
					pid: item.metadata.doi,
					title: item.metadata.title,
					summary: item.metadata.summary,
					license: item.metadata.license,
					locale: item.metadata.locale,
					translations: item.metadata.translations,
					"publication-date": item.metadata["publication-date"],
					"content-type": item.metadata["content-type"],
					tags: await Promise.all(item.metadata.tags.map(createTag)),
					authors: await Promise.all(item.metadata.authors.map(createPerson)),
					editors:
						"editors" in item.metadata
							? await Promise.all(item.metadata.editors.map(createPerson))
							: [],
					contributors:
						"contributors" in item.metadata
							? await Promise.all(item.metadata.contributors.map(createPerson))
							: [],
					sources:
						"sources" in item.metadata
							? await Promise.all(item.metadata.sources.map(createSource))
							: [],
				});
			}),
		);
	}

	return {
		curricula,
		resources,
	};
}

async function generate() {
	const start = performance.now();

	const { curricula, resources } = await createMetadata();

	const outputFolder = join(process.cwd(), "public", "metadata");

	await writeFile(join(outputFolder, "curricula.json"), JSON.stringify(curricula), {
		encoding: "utf-8",
	});
	await writeFile(join(outputFolder, "resources.json"), JSON.stringify(resources), {
		encoding: "utf-8",
	});

	const end = performance.now();
	const duration = formatters.duration.format(end - start);
	const stats = { duration };

	return stats;
}

generate()
	.then((stats) => {
		log.success(`Successfully generated metadata in ${stats.duration} ms.`);
	})
	.catch((error: unknown) => {
		log.error("Failed to generate metadata.\n", error);
		process.exitCode = 1;
	});
