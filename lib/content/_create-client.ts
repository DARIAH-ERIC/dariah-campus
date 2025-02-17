import "server-only";

import type { Locale } from "@/config/i18n.config";
import { cache } from "react";
import { groupByToMap, keyByToMap } from "@acdh-oeaw/lib";
import config from "@/keystatic.config";
import { compileMdx, type MdxContent } from "@/lib/content/compile-mdx";
import { contentLicenses, contentTypes } from "@/lib/content/options";

import { createReaders } from "@acdh-oeaw/keystatic-lib/reader";

const { createCollectionResource, createSingletonResource } = createReaders(config, compileMdx);

function byId<T extends { id: string }>(values: ReadonlyArray<T>) {
	return keyByToMap(values, (value) => value.id);
}

function byValue<T extends { value: string }>(values: ReadonlyArray<T>) {
	return keyByToMap(values, (value) => value.value);
}

function compareByPublicationDate<T extends { data: { "publication-date": string } }>(a: T, z: T) {
	return a.data["publication-date"].localeCompare(z.data["publication-date"]);
}

function compareByName<T extends { data: { name: string } }>(a: T, z: T) {
	return a.data.name.localeCompare(z.data.name);
}

export const createClient = cache(async function createClient(locale: Locale) {
	const [
		curricula,
		people,
		eventResources,
		externalResources,
		hostedResources,
		pathfinderResources,
		sources,
		tags,
	] = await Promise.all([
		await createCollectionResource("curricula", locale).all(),
		await createCollectionResource("people", locale).all(),
		await createCollectionResource("resources-events", locale).all(),
		await createCollectionResource("resources-external", locale).all(),
		await createCollectionResource("resources-hosted", locale).all(),
		await createCollectionResource("resources-pathfinders", locale).all(),
		await createCollectionResource("sources", locale).all(),
		await createCollectionResource("tags", locale).all(),
	]);

	curricula.sort(compareByPublicationDate);
	people.sort(compareByName);
	eventResources.sort(compareByPublicationDate);
	externalResources.sort(compareByPublicationDate);
	hostedResources.sort(compareByPublicationDate);
	pathfinderResources.sort(compareByPublicationDate);
	sources.sort(compareByName);
	tags.sort(compareByName);

	const curriculaById = byId(curricula);
	const peopleById = byId(people);
	const eventResourcesById = byId(eventResources);
	const externalResourcesById = byId(externalResources);
	const hostedResourcesById = byId(hostedResources);
	const pathfinderResourcesById = byId(pathfinderResources);
	const sourcesById = byId(sources);
	const tagsById = byId(tags);

	const resources = [
		...eventResources,
		...externalResources,
		...hostedResources,
		...pathfinderResources,
	].sort(compareByPublicationDate);
	const resourcesById = byId(resources);

	const licensesById = byValue(contentLicenses);
	const contentTypesById = byValue(contentTypes);

	const curriculaByResourceId = groupByToMap(curricula, (value) =>
		value.data.resources.map((resource) => resource.value),
	);

	const curriculaByTagId = groupByToMap(curricula, (value) => value.data.tags);
	const resourcesByTagId = groupByToMap(resources, (value) => value.data.tags);

	curriculaById.forEach((value, id) => {
		value.data["content-type"] = { value: "curriculum" };
		value.data.editors = value.data.editors.map((id) => peopleById.get(id)!);
		value.data.license = licensesById.get(value.data.license)!;
		value.data["publication-date"] = new Date(value.data["publication-date"]);
		value.data.resources = value.data.resources.map(
			(resource) => resourcesById.get(resource.value)!,
		);
		value.data.tags = value.data.tags.map((id) => tagsById.get(id)!);
	});

	eventResourcesById.forEach((value, id) => {
		value.data.authors = value.data.authors.map((id) => peopleById.get(id)!);
		value.data["content-type"] = { value: "event" };
		value.data["end-date"] =
			value.data["end-date"] != null ? new Date(value.data["end-date"]) : null;
		value.data.license = licensesById.get(value.data.license)!;
		value.data["publication-date"] = new Date(value.data["publication-date"]);
		value.data.sources = value.data.sources.map((id) => sourcesById.get(id)!);
		value.data["start-date"] = new Date(value.data["publication-date"]);
		value.data.tags = value.data.tags.map((id) => tagsById.get(id)!);
	});

	externalResourcesById.forEach((value, id) => {
		value.data.authors = value.data.authors.map((id) => peopleById.get(id)!);
		value.data["content-type"] = contentTypesById.get(value.data["content-type"])!;
		value.data.contributors = value.data.contributors.map((id) => peopleById.get(id)!);
		value.data.editors = value.data.editors.map((id) => peopleById.get(id)!);
		value.data.license = licensesById.get(value.data.license)!;
		value.data["publication-date"] = new Date(value.data["publication-date"]);
		value.data.sources = value.data.sources.map((id) => sourcesById.get(id)!);
		value.data.tags = value.data.tags.map((id) => tagsById.get(id)!);
	});

	hostedResourcesById.forEach((value, id) => {
		value.data.authors = value.data.authors.map((id) => peopleById.get(id)!);
		value.data["content-type"] = contentTypesById.get(value.data["content-type"])!;
		value.data.contributors = value.data.contributors.map((id) => peopleById.get(id)!);
		value.data.editors = value.data.editors.map((id) => peopleById.get(id)!);
		value.data.license = licensesById.get(value.data.license)!;
		value.data["publication-date"] = new Date(value.data["publication-date"]);
		value.data.sources = value.data.sources.map((id) => sourcesById.get(id)!);
		value.data.tags = value.data.tags.map((id) => tagsById.get(id)!);
	});

	pathfinderResourcesById.forEach((value, id) => {
		value.data.authors = value.data.authors.map((id) => peopleById.get(id)!);
		value.data["content-type"] = { value: "pathfinder" };
		value.data.contributors = value.data.contributors.map((id) => peopleById.get(id)!);
		value.data.editors = value.data.editors.map((id) => peopleById.get(id)!);
		value.data.license = licensesById.get(value.data.license)!;
		value.data["publication-date"] = new Date(value.data["publication-date"]);
		value.data.sources = value.data.sources.map((id) => sourcesById.get(id)!);
		value.data.tags = value.data.tags.map((id) => tagsById.get(id)!);
	});

	function getCurricula() {
		return curricula;
	}

	function getCurriculum(id: string) {
		return curriculaById.get(id)!;
	}

	function getPeople() {
		return people;
	}

	function getPerson(id: string) {
		return peopleById.get(id)!;
	}

	function getEventResources() {
		return eventResources;
	}

	function getEventResource(id: string) {
		return eventResourcesById.get(id)!;
	}

	function getExternalResources() {
		return externalResources;
	}

	function getExternalResource(id: string) {
		return externalResourcesById.get(id)!;
	}

	function getHostedResources() {
		return hostedResources;
	}

	function getHostedResource(id: string) {
		return hostedResourcesById.get(id)!;
	}

	function getPathfinderResources() {
		return pathfinderResources;
	}

	function getPathfinderResource(id: string) {
		return pathfinderResourcesById.get(id)!;
	}

	function getSources() {
		return sources;
	}

	function getSource(id: string) {
		return sourcesById.get(id)!;
	}

	function getTags() {
		return tags;
	}

	function getTag(id: string) {
		return tagsById.get(id)!;
	}

	return {
		getCurricula,
		getCurriculum,
		getPeople,
		getPerson,
		getEventResources,
		getEventResource,
		getExternalResources,
		getExternalResource,
		getHostedResources,
		getHostedResource,
		getPathfinderResources,
		getPathfinderResource,
		getSources,
		getSource,
		getTags,
		getTag,
	};
});
