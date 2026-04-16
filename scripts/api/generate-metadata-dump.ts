import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { assert, log } from "@acdh-oeaw/lib";
import * as v from "valibot";

import { client } from "@/lib/content/client";
import { resources as sharedMetadata } from "@/lib/content/shared-metadata.config";
import {
	type CurriculumMetadata,
	curriculumMetadataSchema,
	type ResourceMetadata,
	resourceMetadataSchema,
} from "@/scripts/api/metadata-schemas";

const formatters = {
	duration: new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

async function loadJsonDir<T extends Record<string, unknown>>(
	dir: string,
): Promise<Map<string, T>> {
	const files = await readdir(dir);
	const map = new Map<string, T>();
	await Promise.all(
		files
			.filter((f) => {return f.endsWith(".json")})
			.map(async (file) => {
				const raw = await readFile(join(dir, file), "utf-8");
				map.set(file.slice(0, -5), JSON.parse(raw) as T);
			}),
	);
	return map;
}

export async function createMetadata(): Promise<{
	curricula: Array<CurriculumMetadata>;
	resources: Array<ResourceMetadata>;
}> {
	const contentDir = join(process.cwd(), "content", "en");

	const consortiaData = await loadJsonDir<{ "sshoc-marketplace-id": string }>(
		join(contentDir, "dariah-national-consortia"),
	);
	const workingGroupsData = await loadJsonDir<{ "sshoc-marketplace-id": string }>(
		join(contentDir, "dariah-working-groups"),
	);

	function createNationalConsortium(code: string) {
		return {
			code,
			"sshoc-marketplace-id": consortiaData.get(code)?.["sshoc-marketplace-id"] ?? "",
		};
	}

	function createWorkingGroup(slug: string) {
		return {
			slug,
			"sshoc-marketplace-id": workingGroupsData.get(slug)?.["sshoc-marketplace-id"] ?? "",
		};
	}

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
				"dariah-national-consortia":
					item.metadata["dariah-national-consortia"].map(createNationalConsortium),
				"dariah-working-groups": item.metadata["dariah-working-groups"].map(createWorkingGroup),
				domain: sharedMetadata.domain,
				"target-group": sharedMetadata["target-group"],
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
					"dariah-national-consortia":
						item.metadata["dariah-national-consortia"].map(createNationalConsortium),
					"dariah-working-groups": item.metadata["dariah-working-groups"].map(createWorkingGroup),
					domain: sharedMetadata.domain,
					"target-group": sharedMetadata["target-group"],
				});
			}),
		);
	}

	return {
		curricula: v.parse(v.array(curriculumMetadataSchema), curricula),
		resources: v.parse(v.array(resourceMetadataSchema), resources),
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
