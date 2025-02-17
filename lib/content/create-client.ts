import "server-only";

import { createReaders } from "@acdh-oeaw/keystatic-lib/reader";
import { assert, groupByToMap, keyByToMap, promise } from "@acdh-oeaw/lib";
import { cache } from "react";

import type { Locale } from "@/config/i18n.config";
import config from "@/keystatic.config";
import { compileMdx } from "@/lib/content/compile-mdx";
import {
	contentLanguages as contentLanguageOptions,
	contentLicenses as contentLicenseOptions,
	contentTypes as contentTypeOptions,
} from "@/lib/content/options";

// TODO: add shared metadata
//bTODO: use ContentTypes etc.
// TODO: add byId methods

function compareByName<T extends { data: { name: string } }>(a: T, z: T) {
	return a.data.name.localeCompare(z.data.name);
}

function compareByPublicationDate<T extends { data: { "publication-date": string } }>(a: T, z: T) {
	/** Sorting as date strings should be fine and saves conversion to `Date`. */
	return z.data["publication-date"].localeCompare(a.data["publication-date"]);
}

function compareByTitle<T extends { data: { title: string } }>(a: T, z: T) {
	return a.data.title.localeCompare(z.data.title);
}

function groupByResourceId<T extends { data: { resources: ReadonlyArray<{ value: string }> } }>(
	values: ReadonlyArray<T>,
) {
	return groupByToMap(values, (value) => {
		return value.data.resources.map((resource) => {
			return resource.value;
		});
	});
}

function groupBySourceId<T extends { data: { sources: Array<string> } }>(values: ReadonlyArray<T>) {
	return groupByToMap(values, (value) => {
		return value.data.sources;
	});
}

function groupByTagId<T extends { data: { tags: Array<string> } }>(values: ReadonlyArray<T>) {
	return groupByToMap(values, (value) => {
		return value.data.tags;
	});
}

function keyById<T extends { id: string }>(values: ReadonlyArray<T>) {
	return keyByToMap(values, (value) => {
		return value.id;
	});
}

function keyByValue<T extends { value: string }>(values: ReadonlyArray<T>) {
	return keyByToMap(values, (value) => {
		return value.value;
	});
}

const {
	createCollectionResource: _createCollectionResource,
	createSingletonResource: _createSingletonResource,
} = createReaders(config, compileMdx);

const createCollectionResource = cache(_createCollectionResource);
const createSingletonResource = cache(_createSingletonResource);

// eslint-disable-next-line @typescript-eslint/require-await
export const createClient = cache(async function createClient(locale: Locale) {
	const curricula = {
		async ids() {
			const ids = await createCollectionResource("curricula", locale).list();

			return ids;
		},

		async all() {
			const curricula = await createCollectionResource("curricula", locale).all();

			curricula.sort(compareByPublicationDate);

			return curricula;
		},

		async get(id: string) {
			const curriculum = await createCollectionResource("curricula", locale).read(id);

			const curriculaByTagId = groupByTagId(
				await createCollectionResource("curricula", locale).all(),
			);
			const licensesById = keyByValue(contentLicenseOptions);
			const peopleById = keyById(await createCollectionResource("people", locale).all());
			const tagsById = keyById(await createCollectionResource("tags", locale).all());

			const resourcesById = {
				events: keyById(await createCollectionResource("resources-events", locale).all()),
				external: keyById(await createCollectionResource("resources-external", locale).all()),
				hosted: keyById(await createCollectionResource("resources-hosted", locale).all()),
				pathfinders: keyById(await createCollectionResource("resources-pathfinders", locale).all()),
			};

			const contentType = { value: "curriculum" as const };
			const editors = curriculum.data.editors.map((id) => {
				return peopleById.get(id)!;
			});
			const license = licensesById.get(curriculum.data.license)!;
			const publicationDate = new Date(curriculum.data["publication-date"]);
			const resources = curriculum.data.resources.map((resource) => {
				switch (resource.discriminant) {
					case "resources-events": {
						return resourcesById.events.get(resource.value)!;
					}

					case "resources-external": {
						return resourcesById.external.get(resource.value)!;
					}

					case "resources-hosted": {
						return resourcesById.hosted.get(resource.value)!;
					}

					case "resources-pathfinders": {
						return resourcesById.pathfinders.get(resource.value)!;
					}
				}
			});
			const tags = curriculum.data.tags.map((id) => {
				return tagsById.get(id)!;
			});

			const related = new Set<NonNullable<ReturnType<typeof curriculaByTagId.get>>[number]>();
			curriculum.data.tags.forEach((id) => {
				const curricula = curriculaByTagId.get(id)!;

				curricula.forEach((_curriculum) => {
					if (_curriculum.id === curriculum.id) {
						return;
					}

					related.add(_curriculum);
				});
			});

			return {
				...curriculum,
				data: {
					...curriculum.data,
					contentType,
					editors,
					license,
					"publication-date": publicationDate,
					resources,
					tags,
				},
				related,
			};
		},
	};

	const documentation = {
		async ids() {
			const ids = await createCollectionResource("documentation", locale).list();

			return ids;
		},

		async all() {
			const documentationPages = await createCollectionResource("documentation", locale).all();

			documentationPages.sort(compareByTitle);

			return documentationPages;
		},

		async get(id: string) {
			const documentationPage = await createCollectionResource("documentation", locale).read(id);

			return documentationPage;
		},
	};

	const people = {
		async ids() {
			const ids = await createCollectionResource("people", locale).list();

			return ids;
		},

		async all() {
			const people = await createCollectionResource("people", locale).all();

			people.sort(compareByName);

			return people;
		},

		async get(id: string) {
			const person = await createCollectionResource("people", locale).read(id);

			return person;
		},
	};

	const resources = {
		events: {
			async ids() {
				const ids = await createCollectionResource("resources-events", locale).list();

				return ids;
			},

			async all() {
				const resources = await createCollectionResource("resources-events", locale).all();

				resources.sort(compareByPublicationDate);

				return resources;
			},

			async get(id: string) {
				const resource = await createCollectionResource("resources-events", locale).read(id);

				const curriculaByResourceId = groupByResourceId(
					await createCollectionResource("curricula", locale).all(),
				);
				const licensesById = keyByValue(contentLicenseOptions);
				const peopleById = keyById(await createCollectionResource("people", locale).all());
				const resourcesByTagId = groupByTagId(
					(
						await Promise.all([
							createCollectionResource("resources-events", locale).all(),
							createCollectionResource("resources-external", locale).all(),
							createCollectionResource("resources-hosted", locale).all(),
							createCollectionResource("resources-pathfinders", locale).all(),
						])
					).flat(),
				);
				const sourcesById = keyById(await createCollectionResource("sources", locale).all());
				const tagsById = keyById(await createCollectionResource("tags", locale).all());

				const authors = resource.data.authors.map((id) => {
					return peopleById.get(id)!;
				});
				const contentType = { value: "event" as const };
				const endDate =
					resource.data["end-date"] != null ? new Date(resource.data["end-date"]) : null;
				const license = licensesById.get(resource.data.license)!;
				const publicationDate = new Date(resource.data["publication-date"]);
				const sources = resource.data.sources.map((id) => {
					return sourcesById.get(id)!;
				});
				const startDate = new Date(resource.data["start-date"]);
				const tags = resource.data.tags.map((id) => {
					return tagsById.get(id)!;
				});

				const related = new Set<NonNullable<ReturnType<typeof resourcesByTagId.get>>[number]>();
				resource.data.tags.forEach((id) => {
					const resources = resourcesByTagId.get(id)!;

					resources.forEach((_resource) => {
						if (_resource.id === _resource.id) {
							return;
						}

						related.add(_resource);
					});
				});

				const curricula = curriculaByResourceId.get(resource.id) ?? [];

				return {
					...resource,
					data: {
						...resource.data,
						authors,
						"content-type": contentType,
						"end-date": endDate,
						license,
						"publication-date": publicationDate,
						sources,
						"start-date": startDate,
						tags,
					},
					related,
					curricula,
				};
			},
		},

		external: {
			async ids() {
				const ids = await createCollectionResource("resources-external", locale).list();

				return ids;
			},

			async all() {
				const resources = await createCollectionResource("resources-external", locale).all();

				resources.sort(compareByPublicationDate);

				return resources;
			},

			async get(id: string) {
				const resource = await createCollectionResource("resources-external", locale).read(id);

				const contentTypesById = keyByValue(contentTypeOptions);
				const curriculaByResourceId = groupByResourceId(
					await createCollectionResource("curricula", locale).all(),
				);
				const licensesById = keyByValue(contentLicenseOptions);
				const peopleById = keyById(await createCollectionResource("people", locale).all());
				const resourcesByTagId = groupByTagId(
					(
						await Promise.all([
							createCollectionResource("resources-events", locale).all(),
							createCollectionResource("resources-external", locale).all(),
							createCollectionResource("resources-hosted", locale).all(),
							createCollectionResource("resources-pathfinders", locale).all(),
						])
					).flat(),
				);
				const sourcesById = keyById(await createCollectionResource("sources", locale).all());
				const tagsById = keyById(await createCollectionResource("tags", locale).all());

				const authors = resource.data.authors.map((id) => {
					return peopleById.get(id)!;
				});
				const contentType = contentTypesById.get(resource.data["content-type"])!;
				const contributors = resource.data.contributors.map((id) => {
					return peopleById.get(id)!;
				});
				const editors = resource.data.editors.map((id) => {
					return peopleById.get(id)!;
				});
				const license = licensesById.get(resource.data.license)!;
				const publicationDate = new Date(resource.data["publication-date"]);
				const remotePublicationDate = new Date(resource.data.remote["publication-date"]);
				const sources = resource.data.sources.map((id) => {
					return sourcesById.get(id)!;
				});
				const tags = resource.data.tags.map((id) => {
					return tagsById.get(id)!;
				});

				const related = new Set<NonNullable<ReturnType<typeof resourcesByTagId.get>>[number]>();
				resource.data.tags.forEach((id) => {
					const resources = resourcesByTagId.get(id)!;

					resources.forEach((_resource) => {
						if (_resource.id === _resource.id) {
							return;
						}

						related.add(_resource);
					});
				});

				const curricula = curriculaByResourceId.get(resource.id) ?? [];

				return {
					...resource,
					data: {
						...resource.data,
						authors,
						"content-type": contentType,
						contributors,
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
					related,
					curricula,
				};
			},
		},

		hosted: {
			async ids() {
				const ids = await createCollectionResource("resources-hosted", locale).list();

				return ids;
			},

			async all() {
				const resources = await createCollectionResource("resources-hosted", locale).all();

				resources.sort(compareByPublicationDate);

				return resources;
			},

			async get(id: string) {
				const resource = await createCollectionResource("resources-hosted", locale).read(id);

				const contentTypesById = keyByValue(contentTypeOptions);
				const curriculaByResourceId = groupByResourceId(
					await createCollectionResource("curricula", locale).all(),
				);
				const licensesById = keyByValue(contentLicenseOptions);
				const peopleById = keyById(await createCollectionResource("people", locale).all());
				const resourcesByTagId = groupByTagId(
					(
						await Promise.all([
							createCollectionResource("resources-events", locale).all(),
							createCollectionResource("resources-external", locale).all(),
							createCollectionResource("resources-hosted", locale).all(),
							createCollectionResource("resources-pathfinders", locale).all(),
						])
					).flat(),
				);
				const sourcesById = keyById(await createCollectionResource("sources", locale).all());
				const tagsById = keyById(await createCollectionResource("tags", locale).all());

				const authors = resource.data.authors.map((id) => {
					return peopleById.get(id)!;
				});
				const contentType = contentTypesById.get(resource.data["content-type"])!;
				const contributors = resource.data.contributors.map((id) => {
					return peopleById.get(id)!;
				});
				const editors = resource.data.editors.map((id) => {
					return peopleById.get(id)!;
				});
				const license = licensesById.get(resource.data.license)!;
				const publicationDate = new Date(resource.data["publication-date"]);
				const sources = resource.data.sources.map((id) => {
					return sourcesById.get(id)!;
				});
				const tags = resource.data.tags.map((id) => {
					return tagsById.get(id)!;
				});

				const related = new Set<NonNullable<ReturnType<typeof resourcesByTagId.get>>[number]>();
				resource.data.tags.forEach((id) => {
					const resources = resourcesByTagId.get(id)!;

					resources.forEach((_resource) => {
						if (_resource.id === _resource.id) {
							return;
						}

						related.add(_resource);
					});
				});

				const curricula = curriculaByResourceId.get(resource.id) ?? [];

				return {
					...resource,
					data: {
						...resource.data,
						authors,
						"content-type": contentType,
						contributors,
						editors,
						license,
						"publication-date": publicationDate,
						sources,
						tags,
					},
					related,
					curricula,
				};
			},
		},

		pathfinders: {
			async ids() {
				const ids = await createCollectionResource("resources-pathfinders", locale).list();

				return ids;
			},

			async all() {
				const resources = await createCollectionResource("resources-pathfinders", locale).all();

				resources.sort(compareByPublicationDate);

				return resources;
			},

			async get(id: string) {
				const resource = await createCollectionResource("resources-pathfinders", locale).read(id);

				const curriculaByResourceId = groupByResourceId(
					await createCollectionResource("curricula", locale).all(),
				);
				const licensesById = keyByValue(contentLicenseOptions);
				const peopleById = keyById(await createCollectionResource("people", locale).all());
				const resourcesByTagId = groupByTagId(
					(
						await Promise.all([
							createCollectionResource("resources-events", locale).all(),
							createCollectionResource("resources-external", locale).all(),
							createCollectionResource("resources-hosted", locale).all(),
							createCollectionResource("resources-pathfinders", locale).all(),
						])
					).flat(),
				);
				const sourcesById = keyById(await createCollectionResource("sources", locale).all());
				const tagsById = keyById(await createCollectionResource("tags", locale).all());

				const authors = resource.data.authors.map((id) => {
					return peopleById.get(id)!;
				});
				const contentType = { value: "pathfinder" as const };
				const contributors = resource.data.contributors.map((id) => {
					return peopleById.get(id)!;
				});
				const editors = resource.data.editors.map((id) => {
					return peopleById.get(id)!;
				});
				const license = licensesById.get(resource.data.license)!;
				const publicationDate = new Date(resource.data["publication-date"]);
				const sources = resource.data.sources.map((id) => {
					return sourcesById.get(id)!;
				});
				const tags = resource.data.tags.map((id) => {
					return tagsById.get(id)!;
				});

				const related = new Set<NonNullable<ReturnType<typeof resourcesByTagId.get>>[number]>();
				resource.data.tags.forEach((id) => {
					const resources = resourcesByTagId.get(id)!;

					resources.forEach((_resource) => {
						if (_resource.id === _resource.id) {
							return;
						}

						related.add(_resource);
					});
				});

				const curricula = curriculaByResourceId.get(resource.id) ?? [];

				return {
					...resource,
					data: {
						...resource.data,
						authors,
						"content-type": contentType,
						contributors,
						editors,
						license,
						"publication-date": publicationDate,
						sources,
						tags,
					},
					related,
					curricula,
				};
			},
		},

		async ids() {
			const resources = await Promise.all([
				createCollectionResource("resources-events", locale).list(),
				createCollectionResource("resources-external", locale).list(),
				createCollectionResource("resources-hosted", locale).list(),
				createCollectionResource("resources-pathfinders", locale).list(),
			]);

			return resources;
		},

		async all() {
			const resources = (
				await Promise.all([
					createCollectionResource("resources-events", locale).all(),
					createCollectionResource("resources-external", locale).all(),
					createCollectionResource("resources-hosted", locale).all(),
					createCollectionResource("resources-pathfinders", locale).all(),
				])
			).flat();

			resources.sort(compareByPublicationDate);

			return resources;
		},

		async get(id: string) {
			async function read(id: string) {
				const event = await promise(() => {
					return createCollectionResource("resources-events", locale).read(id);
				});
				if (event.data) return event.data;

				const external = await promise(() => {
					return createCollectionResource("resources-external", locale).read(id);
				});
				if (external.data) return external.data;

				const hosted = await promise(() => {
					return createCollectionResource("resources-hosted", locale).read(id);
				});
				if (hosted.data) return hosted.data;

				const pathfinder = await promise(() => {
					return createCollectionResource("resources-pathfinders", locale).read(id);
				});
				if (pathfinder.data) return pathfinder.data;

				assert(false, `Unknown resource id ${id}.`);
			}

			const resource = await read(id);

			const contentTypesById = keyByValue(contentTypeOptions);
			const curriculaByResourceId = groupByResourceId(
				await createCollectionResource("curricula", locale).all(),
			);
			const licensesById = keyByValue(contentLicenseOptions);
			const peopleById = keyById(await createCollectionResource("people", locale).all());
			const resourcesByTagId = groupByTagId(
				(
					await Promise.all([
						createCollectionResource("resources-events", locale).all(),
						createCollectionResource("resources-external", locale).all(),
						createCollectionResource("resources-hosted", locale).all(),
						createCollectionResource("resources-pathfinders", locale).all(),
					])
				).flat(),
			);
			const sourcesById = keyById(await createCollectionResource("sources", locale).all());
			const tagsById = keyById(await createCollectionResource("tags", locale).all());

			const authors = resource.data.authors.map((id) => {
				return peopleById.get(id)!;
			});
			const license = licensesById.get(resource.data.license)!;
			const publicationDate = new Date(resource.data["publication-date"]);
			const sources = resource.data.sources.map((id) => {
				return sourcesById.get(id)!;
			});
			const tags = resource.data.tags.map((id) => {
				return tagsById.get(id)!;
			});

			const related = new Set<NonNullable<ReturnType<typeof resourcesByTagId.get>>[number]>();
			resource.data.tags.forEach((id) => {
				const resources = resourcesByTagId.get(id)!;

				resources.forEach((_resource) => {
					if (_resource.id === _resource.id) {
						return;
					}

					related.add(_resource);
				});
			});

			const curricula = curriculaByResourceId.get(resource.id) ?? [];

			switch (resource.collection) {
				case "resources-events": {
					const contentType = { value: "event" as const };
					const endDate =
						resource.data["end-date"] != null ? new Date(resource.data["end-date"]) : null;
					const startDate = new Date(resource.data["start-date"]);

					return {
						...resource,
						data: {
							...resource.data,
							authors,
							"content-type": contentType,
							"end-date": endDate,
							license,
							"publication-date": publicationDate,
							sources,
							"start-date": startDate,
							tags,
						},
						related,
						curricula,
					};
				}

				case "resources-external": {
					const contentType = contentTypesById.get(resource.data["content-type"])!;
					const contributors = resource.data.contributors.map((id) => {
						return peopleById.get(id)!;
					});
					const editors = resource.data.editors.map((id) => {
						return peopleById.get(id)!;
					});
					const remotePublicationDate = new Date(resource.data.remote["publication-date"]);

					return {
						...resource,
						data: {
							...resource.data,
							authors,
							"content-type": contentType,
							contributors,
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
						related,
						curricula,
					};
				}

				case "resources-hosted": {
					const contentType = contentTypesById.get(resource.data["content-type"])!;
					const contributors = resource.data.contributors.map((id) => {
						return peopleById.get(id)!;
					});
					const editors = resource.data.editors.map((id) => {
						return peopleById.get(id)!;
					});

					return {
						...resource,
						data: {
							...resource.data,
							authors,
							"content-type": contentType,
							contributors,
							editors,
							license,
							"publication-date": publicationDate,
							sources,
							tags,
						},
						related,
						curricula,
					};
				}

				case "resources-pathfinders": {
					const contentType = { value: "pathfinder" as const };
					const contributors = resource.data.contributors.map((id) => {
						return peopleById.get(id)!;
					});
					const editors = resource.data.editors.map((id) => {
						return peopleById.get(id)!;
					});

					return {
						...resource,
						data: {
							...resource.data,
							authors,
							"content-type": contentType,
							contributors,
							editors,
							license,
							"publication-date": publicationDate,
							sources,
							tags,
						},
						related,
						curricula,
					};
				}
			}
		},
	};

	const sources = {
		async ids() {
			const ids = await createCollectionResource("sources", locale).list();

			return ids;
		},

		async all() {
			const sources = await createCollectionResource("sources", locale).all();

			sources.sort(compareByName);

			return sources;
		},

		async get(id: string) {
			const source = await createCollectionResource("sources", locale).read(id);

			const resourcesBySourceId = groupBySourceId(
				(
					await Promise.all([
						createCollectionResource("resources-events", locale).all(),
						createCollectionResource("resources-external", locale).all(),
						createCollectionResource("resources-hosted", locale).all(),
						createCollectionResource("resources-pathfinders", locale).all(),
					])
				).flat(),
			);

			const resources = resourcesBySourceId.get(id) ?? [];

			return {
				...source,
				resources,
			};
		},
	};

	const tags = {
		async ids() {
			const ids = await createCollectionResource("tags", locale).list();

			return ids;
		},

		async all() {
			const tags = await createCollectionResource("tags", locale).all();

			tags.sort(compareByName);

			return tags;
		},

		async get(id: string) {
			const tag = await createCollectionResource("tags", locale).read(id);

			const resourcesByTagId = groupByTagId(
				(
					await Promise.all([
						createCollectionResource("resources-events", locale).all(),
						createCollectionResource("resources-external", locale).all(),
						createCollectionResource("resources-hosted", locale).all(),
						createCollectionResource("resources-pathfinders", locale).all(),
					])
				).flat(),
			);

			const resources = resourcesByTagId.get(id) ?? [];

			return {
				...tag,
				resources,
			};
		},
	};

	const indexPage = {
		async get() {
			const indexPage = await createSingletonResource("index-page", locale).read();

			return indexPage;
		},
	};

	const metadata = {
		async get() {
			const metadata = await createSingletonResource("metadata", locale).read();

			return metadata;
		},
	};

	const navigation = {
		async get() {
			const navigation = await createSingletonResource("navigation", locale).read();

			return navigation;
		},
	};

	const contentLanguages = {
		// eslint-disable-next-line @typescript-eslint/require-await
		async ids() {
			return contentLanguageOptions.map((contentLanguage) => {
				return contentLanguage.value;
			});
		},

		// eslint-disable-next-line @typescript-eslint/require-await
		async all() {
			return contentLanguageOptions;
		},

		// eslint-disable-next-line @typescript-eslint/require-await
		async get(id: string) {
			const contentLanguagesById = keyByValue(contentLanguageOptions);

			const contentLanguage = contentLanguagesById.get(id);

			return contentLanguage;
		},
	};

	const contentLicenses = {
		// eslint-disable-next-line @typescript-eslint/require-await
		async ids() {
			return contentLicenseOptions.map((contentLicense) => {
				return contentLicense.value;
			});
		},

		// eslint-disable-next-line @typescript-eslint/require-await
		async all() {
			return contentLicenseOptions;
		},

		// eslint-disable-next-line @typescript-eslint/require-await
		async get(id: string) {
			const contentLicensesById = keyByValue(contentLicenseOptions);

			const contentLicense = contentLicensesById.get(id);

			return contentLicense;
		},
	};

	const contentTypes = {
		// eslint-disable-next-line @typescript-eslint/require-await
		async ids() {
			return [
				...contentTypeOptions,
				{ value: "curriculum", label: "Curriculum" },
				{ value: "event", label: "Event" },
				{ value: "pathfinder", label: "Pathfinder" },
			].map((contentType) => {
				return contentType.value;
			});
		},

		// eslint-disable-next-line @typescript-eslint/require-await
		async all() {
			return [
				...contentTypeOptions,
				{ value: "curriculum", label: "Curriculum" },
				{ value: "event", label: "Event" },
				{ value: "pathfinder", label: "Pathfinder" },
			];
		},

		// eslint-disable-next-line @typescript-eslint/require-await
		async get(id: string) {
			const contentTypesById = keyByValue([
				...contentTypeOptions,
				{ value: "curriculum", label: "Curriculum" },
				{ value: "event", label: "Event" },
				{ value: "pathfinder", label: "Pathfinder" },
			]);

			const contentType = contentTypesById.get(id);

			return contentType;
		},
	};

	return {
		contentLanguages,
		contentLicenses,
		contentTypes,
		curricula,
		documentation,
		people,
		resources,
		sources,
		tags,
		indexPage,
		metadata,
		navigation,
	};
});
