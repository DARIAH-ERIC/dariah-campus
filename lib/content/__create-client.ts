import "server-only";

import type { WithoutI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import type { EntryWithResolvedLinkedFiles } from "@keystatic/core/reader";

import { createReaders } from "@acdh-oeaw/keystatic-lib/reader";
import { groupByToMap, keyByToMap } from "@acdh-oeaw/lib";
import { compareDesc } from "date-fns";
import { cache } from "react";

import config from "@/keystatic.config";
import type { Locale } from "@/config/i18n.config";
import { compileMdx, type MdxContent } from "@/lib/content/compile-mdx";
import { contentLicenses, contentTypes } from "@/lib/content/options";

const { createCollectionResource, createSingletonResource } = createReaders(config, compileMdx);

//

type Collections = typeof config.collections;
type Singletons = typeof config.singletons;

interface CollectionEntry<TCollection extends WithoutI18nPrefix<keyof Collections, Locale>> {
	collection: TCollection;
	id: string;
	md5: string;
	data: EntryWithResolvedLinkedFiles<Collections[`${Locale}:${TCollection}`]>;
	compile: (
		code: string,
	) => Promise<MdxContent<EntryWithResolvedLinkedFiles<Collections[`${Locale}:${TCollection}`]>>>;
}

interface SingletonEntry<TSingleton extends WithoutI18nPrefix<keyof Singletons, Locale>> {
	singleton: TSingleton;
	md5: string;
	data: EntryWithResolvedLinkedFiles<Singletons[`${Locale}:${TSingleton}`]>;
	compile: (
		code: string,
	) => Promise<MdxContent<EntryWithResolvedLinkedFiles<Singletons[`${Locale}:${TSingleton}`]>>>;
}

//

export const createClient = cache(async function createClient(locale: Locale) {
	const curricula = createCollectionResource("curricula", locale);
	const people = createCollectionResource("people", locale);
	const eventResources = createCollectionResource("resources-events", locale);
	const externalResources = createCollectionResource("resources-external", locale);
	const hostedResources = createCollectionResource("resources-hosted", locale);
	const pathfinderResources = createCollectionResource("resources-pathfinders", locale);
	const sources = createCollectionResource("sources", locale);
	const tags = createCollectionResource("tags", locale);

	//

	const [
		_allCurricula,
		_allPeople,
		_allEventResources,
		_allExternalResources,
		_allHostedResources,
		_allPathfinderResources,
		_allSources,
		_allTags,
	] = await Promise.all([
		curricula.all(),
		people.all(),
		eventResources.all(),
		externalResources.all(),
		hostedResources.all(),
		pathfinderResources.all(),
		sources.all(),
		tags.all(),
	]);

	//

	function createCurriculum(input: CollectionEntry<"curricula">) {
		const contentType = { value: "curriculum" as const };
		const editors = input.data.editors.map((id) => peopleById.get(id)!);
		const license = licensesById.get(input.data["license"])!;
		// const sources = input.data.sources.map((id) => sourcesById.get(id)!);
		const tags = input.data.tags.map((id) => tagsById.get(id)!);
		const publicationDate = new Date(input.data["publication-date"]);

		const resources = input.data.resources.map((entry) => {
			switch (entry.discriminant) {
				case "resources-events": {
					return eventResourcesById.get(entry.value)!;
				}

				case "resources-external": {
					return externalResourcesById.get(entry.value)!;
				}

				case "resources-hosted": {
					return hostedResourcesById.get(entry.value)!;
				}

				case "resources-pathfinders": {
					return pathfinderResourcesById.get(entry.value)!;
				}
			}
		});

		const related = new Set();
		input.data.tags.forEach((id) => {
			const curricula = curriculaByTagId.get(id)!;

			curricula.forEach((curriculum) => {
				if (curriculum.id === id) {
					return;
				}

				related.add(curriculum);
			});
		});

		return {
			...input,
			data: {
				...input.data,
				contentType,
				editors,
				license,
				"publication-date": publicationDate,
				resources,
				// sources,
				tags,
			},
			related,
		};
	}

	function createPerson(input: CollectionEntry<"people">) {
		return input;
	}

	function createEventResource(input: CollectionEntry<"resources-events">) {
		return input;
	}

	function createExternalResource(input: CollectionEntry<"resources-external">) {
		return input;
	}

	function createHostedResource(input: CollectionEntry<"resources-hosted">) {
		return input;
	}

	function createPathfinderResource(input: CollectionEntry<"resources-pathfinders">) {
		return input;
	}

	function createSource(input: CollectionEntry<"sources">) {
		return input;
	}

	function createTag(input: CollectionEntry<"tags">) {
		return input;
	}

	//

	const allCurricula = _allCurricula.map(createCurriculum);
	const allPeople = _allPeople.map(createPerson);
	const allEventResources = _allEventResources.map(createEventResource);
	const allExternalResources = _allExternalResources.map(createExternalResource);
	const allHostedResources = _allHostedResources.map(createHostedResource);
	const allPathfinderResources = _allPathfinderResources.map(createPathfinderResource);
	const allSources = _allSources.map(createSource);
	const allTags = _allTags.map(createTag);

	//

	allCurricula.sort((a, z) =>
		compareDesc(new Date(a.data["publication-date"]), new Date(z.data["publication-date"])),
	);
	allPeople.sort((a, z) => a.data.name.localeCompare(z.data.name));
	allEventResources.sort((a, z) =>
		compareDesc(new Date(a.data["publication-date"]), new Date(z.data["publication-date"])),
	);
	allExternalResources.sort((a, z) =>
		compareDesc(new Date(a.data["publication-date"]), new Date(z.data["publication-date"])),
	);
	allHostedResources.sort((a, z) =>
		compareDesc(new Date(a.data["publication-date"]), new Date(z.data["publication-date"])),
	);
	allPathfinderResources.sort((a, z) =>
		compareDesc(new Date(a.data["publication-date"]), new Date(z.data["publication-date"])),
	);
	allSources.sort((a, z) => a.data.name.localeCompare(z.data.name));
	allTags.sort((a, z) => a.data.name.localeCompare(z.data.name));

	//

	const allResources = [
		...allEventResources,
		...allExternalResources,
		...allHostedResources,
		...allPathfinderResources,
	].sort((a, z) =>
		compareDesc(new Date(a.data["publication-date"]), new Date(z.data["publication-date"])),
	);

	//

	const curriculaById = keyByToMap(allCurricula, (entry) => entry.id);
	const peopleById = keyByToMap(allPeople, (entry) => entry.id);
	const eventResourcesById = keyByToMap(allEventResources, (entry) => entry.id);
	const externalResourcesById = keyByToMap(allExternalResources, (entry) => entry.id);
	const hostedResourcesById = keyByToMap(allHostedResources, (entry) => entry.id);
	const pathfinderResourcesById = keyByToMap(allPathfinderResources, (entry) => entry.id);
	const sourcesById = keyByToMap(allSources, (entry) => entry.id);
	const tagsById = keyByToMap(allTags, (entry) => entry.id);

	const resourcesById = keyByToMap(allResources, (entry) => entry.id);

	//

	const licensesById = keyByToMap(contentLicenses, (entry) => entry.value);
	const contentTypesById = keyByToMap(contentTypes, (entry) => entry.value);

	//

	const curriculaByResourceId = groupByToMap(allCurricula, (entry) =>
		entry.data.resources.map((resource) => resource.value),
	);
	const curriculaByTagId = groupByToMap(allCurricula, (entry) => entry.data.tags);
	const resourcesByTagId = groupByToMap(allResources, (entry) => entry.data.tags);

	//

	function getCurricula() {
		return allCurricula;
	}

	async function getCurriculum(id: string) {
		const resource = await curricula.read(id);
	}

	async function getEventResources() {
		return await allEventResources;
	}

	async function getEventResource(id: string) {
		const resource = await eventResources.read(id);

		const authors = resource.data.authors.map((id) => peopleById.get(id)!);
		const contentType = { value: "event" as const };
		const license = licensesById.get(resource.data["license"])!;
		const sources = resource.data.sources.map((id) => sourcesById.get(id)!);
		const tags = resource.data.tags.map((id) => tagsById.get(id)!);

		const publicationDate = new Date(resource.data["publication-date"]);

		const related = new Set<(typeof allResources)[number]>();
		resource.data.tags.forEach((id) => {
			const resources = resourcesByTagId.get(id)!;

			resources.forEach((resource) => {
				if (resource.id === id) {
					return;
				}

				related.add(resource);
			});
		});

		const curricula = curriculaByResourceId.get(resource.id) ?? [];

		return {
			...resource,
			data: {
				...resource.data,
				authors,
				contentType,
				license,
				"publication-date": publicationDate,
				sources,
				tags,
			},
			curricula,
			related,
		};
	}

	async function getExternalResources() {
		return await allExternalResources;
	}

	async function getExternalResource(id: string) {
		const resource = await externalResources.read(id);

		const authors = resource.data.authors.map((id) => peopleById.get(id)!);
		const contributors = resource.data.contributors.map((id) => peopleById.get(id)!);
		const contentType = contentTypesById.get(resource.data["content-type"])!;
		const editors = resource.data.editors.map((id) => peopleById.get(id)!);
		const license = licensesById.get(resource.data["license"])!;
		const sources = resource.data.sources.map((id) => sourcesById.get(id)!);
		const tags = resource.data.tags.map((id) => tagsById.get(id)!);

		const publicationDate = new Date(resource.data["publication-date"]);
		const remotePublicationDate = new Date(resource.data.remote["publication-date"]);

		const related = new Set<(typeof allResources)[number]>();
		resource.data.tags.forEach((id) => {
			const resources = resourcesByTagId.get(id)!;

			resources.forEach((resource) => {
				if (resource.id === id) {
					return;
				}

				related.add(resource);
			});
		});

		const curricula = curriculaByResourceId.get(resource.id) ?? [];

		return {
			...resource,
			data: {
				...resource.data,
				authors,
				contributors,
				contentType,
				editors,
				license,
				"publication-date": publicationDate,
				remote: {
					...resource.data.remote,
					"publication-date": remotePublicationDate,
				},
				sources,
				tags,
			},
			curricula,
			related,
		};
	}

	async function getHostedResources() {
		return await allHostedResources;
	}

	async function getHostedResource(id: string) {
		const resource = await hostedResources.read(id);

		const authors = resource.data.authors.map((id) => peopleById.get(id)!);
		const contributors = resource.data.contributors.map((id) => peopleById.get(id)!);
		const contentType = contentTypesById.get(resource.data["content-type"])!;
		const editors = resource.data.editors.map((id) => peopleById.get(id)!);
		const license = licensesById.get(resource.data["license"])!;
		const sources = resource.data.sources.map((id) => sourcesById.get(id)!);
		const tags = resource.data.tags.map((id) => tagsById.get(id)!);

		const publicationDate = new Date(resource.data["publication-date"]);

		const related = new Set<(typeof allResources)[number]>();
		resource.data.tags.forEach((id) => {
			const resources = resourcesByTagId.get(id)!;

			resources.forEach((resource) => {
				if (resource.id === id) {
					return;
				}

				related.add(resource);
			});
		});

		const curricula = curriculaByResourceId.get(resource.id) ?? [];

		return {
			...resource,
			data: {
				...resource.data,
				authors,
				contributors,
				contentType,
				editors,
				license,
				"publication-date": publicationDate,
				sources,
				tags,
			},
			curricula,
			related,
		};
	}

	async function getPathfinderResources() {
		return await allPathfinderResources;
	}

	async function getPathfinderResource(id: string) {
		const resource = await pathfinderResources.read(id);

		const authors = resource.data.authors.map((id) => peopleById.get(id)!);
		const contributors = resource.data.contributors.map((id) => peopleById.get(id)!);
		const contentType = { value: "pathfinder" as const };
		const editors = resource.data.editors.map((id) => peopleById.get(id)!);
		const license = licensesById.get(resource.data["license"])!;
		const sources = resource.data.sources.map((id) => sourcesById.get(id)!);
		const tags = resource.data.tags.map((id) => tagsById.get(id)!);

		const publicationDate = new Date(resource.data["publication-date"]);

		const related = new Set<(typeof allResources)[number]>();
		resource.data.tags.forEach((id) => {
			const resources = resourcesByTagId.get(id)!;

			resources.forEach((resource) => {
				if (resource.id === id) {
					return;
				}

				related.add(resource);
			});
		});

		const curricula = curriculaByResourceId.get(resource.id) ?? [];

		return {
			...resource,
			data: {
				...resource.data,
				authors,
				contributors,
				contentType,
				editors,
				license,
				"publication-date": publicationDate,
				sources,
				tags,
			},
			curricula,
			related,
		};
	}

	function getPeople() {
		return allPeople;
	}

	function getPerson(id: string) {
		return peopleById.get(id)!;
	}

	function getSources() {
		return allSources;
	}

	function getSource(id: string) {
		return sourcesById.get(id)!;
	}

	function getTags() {
		return allTags;
	}

	function getTag(id: string) {
		return tagsById.get(id)!;
	}

	return {
		getCurricula,
		getCurriculum,
		getEventResources,
		getEventResource,
		getExternalResources,
		getExternalResource,
		getHostedResources,
		getHostedResource,
		getPathfinderResources,
		getPathfinderResource,
		getPeople,
		getPerson,
		getSources,
		getSource,
		getTags,
		getTag,
	};
});

//

type Client = Awaited<ReturnType<typeof createClient>>;

export type CurriculaCollectionEntry = Awaited<ReturnType<Client["getCurriculum"]>>;
export type CurriculaCollectionEntries = Awaited<ReturnType<Client["getCurricula"]>>;
export type EventResourcesCollectionEntry = Awaited<ReturnType<Client["getEventResource"]>>;
export type EventResourcesCollectionEntries = Awaited<ReturnType<Client["getEventResources"]>>;
export type ExternalResourcesCollectionEntry = Awaited<ReturnType<Client["getExternalResource"]>>;
export type ExternalResourcesCollectionEntries = Awaited<
	ReturnType<Client["getExternalResources"]>
>;
export type HostedResourcesCollectionEntry = Awaited<ReturnType<Client["getHostedResource"]>>;
export type HostedResourcesCollectionEntries = Awaited<ReturnType<Client["getHostedResources"]>>;
export type PathfinderResourcesCollectionEntry = Awaited<
	ReturnType<Client["getPathfinderResource"]>
>;
export type PathfinderResourcesCollectionEntries = Awaited<
	ReturnType<Client["getPathfinderResources"]>
>;
export type PeopleCollectionEntry = Awaited<ReturnType<Client["getPerson"]>>;
export type PeopleCollectionEntries = Awaited<ReturnType<Client["getPeople"]>>;
export type SourcesCollectionEntry = Awaited<ReturnType<Client["getSource"]>>;
export type SourcesCollectionEntries = Awaited<ReturnType<Client["getSources"]>>;
export type TagsCollectionEntry = Awaited<ReturnType<Client["getTag"]>>;
export type TagsCollectionEntries = Awaited<ReturnType<Client["getTags"]>>;

export type ResourcesCollectionEntry =
	| EventResourcesCollectionEntry
	| ExternalResourcesCollectionEntry
	| HostedResourcesCollectionEntry
	| PathfinderResourcesCollectionEntry;

export type ResourcesCollectionEntries =
	| EventResourcesCollectionEntries
	| ExternalResourcesCollectionEntries
	| HostedResourcesCollectionEntries
	| PathfinderResourcesCollectionEntries;
