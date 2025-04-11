import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { keyByToMap } from "@acdh-oeaw/lib";
import { createReader } from "@keystatic/core/reader";

import type { Locale } from "@/config/i18n.config";
import config from "@/keystatic.config";
import { getLanguage } from "@/lib/i18n/get-language";

function keyById<T extends { slug: string }>(values: ReadonlyArray<T>) {
	return keyByToMap(values, (value) => {
		return value.slug;
	});
}

export async function createMetadata(locale: Locale) {
	const reader = createReader(process.cwd(), config);
	const language = getLanguage(locale);

	const peopleById = keyById(await reader.collections[withI18nPrefix("people", language)].all());
	const sourcesById = keyById(await reader.collections[withI18nPrefix("sources", language)].all());
	const tagsById = keyById(await reader.collections[withI18nPrefix("tags", language)].all());

	const collections = {
		curricula: ["curricula"],
		resources: [
			"resources-events",
			"resources-external",
			"resources-hosted",
			"resources-pathfinders",
		],
	} as const;

	const curricula: Array<object> = [];
	const resources: Array<object> = [];

	for (const name of collections.curricula) {
		const items = await reader.collections[withI18nPrefix(name, language)].all();

		if (items.length === 0) continue;

		items.forEach((item) => {
			const isDraft = "draft" in item.entry && item.entry.draft === true;
			if (isDraft) return;

			const {
				version,
				doi: pid,
				title,
				summary,
				license,
				locale,
				translations,
				resources,
			} = item.entry;

			curricula.push({
				id: item.slug,
				collection: name,
				version,
				pid,
				title,
				summary,
				license,
				locale,
				translations,
				"publication-date": item.entry["publication-date"],
				"content-type": "curriculum",
				tags: item.entry.tags.map((id) => {
					const tag = tagsById.get(id)!;
					return { id, name: tag.entry.name };
				}),
				editors:
					"editors" in item.entry
						? item.entry.editors.map((id) => {
								const person = peopleById.get(id)!;
								return { id, name: person.entry.name };
							})
						: [],
				resources: resources.map((resource) => {
					return { id: resource.value, collection: resource.discriminant };
				}),
			});
		});
	}

	for (const name of collections.resources) {
		const items = await reader.collections[withI18nPrefix(name, language)].all();

		if (items.length === 0) continue;

		items.forEach((item) => {
			const isDraft = "draft" in item.entry && item.entry.draft === true;
			if (isDraft) return;

			const { version, doi: pid, title, summary, license, locale, translations } = item.entry;

			resources.push({
				id: item.slug,
				collection: name,
				version,
				pid,
				title,
				summary,
				license,
				locale,
				translations,
				"publication-date": item.entry["publication-date"],
				"content-type":
					"content-type" in item.entry
						? item.entry["content-type"]
						: name === "resources-events"
							? "event"
							: "pathfinder",
				tags: item.entry.tags.map((id) => {
					const tag = tagsById.get(id)!;
					return { id, name: tag.entry.name };
				}),
				authors: item.entry.authors.map((id) => {
					const person = peopleById.get(id)!;
					return { id, name: person.entry.name };
				}),
				editors:
					"editors" in item.entry
						? item.entry.editors.map((id) => {
								const person = peopleById.get(id)!;
								return { id, name: person.entry.name };
							})
						: [],
				contributors:
					"contributors" in item.entry
						? item.entry.contributors.map((id) => {
								const person = peopleById.get(id)!;
								return { id, name: person.entry.name };
							})
						: [],
				sources:
					"sources" in item.entry
						? item.entry.sources.map((id) => {
								const source = sourcesById.get(id)!;
								return { id, name: source.entry.name };
							})
						: [],
			});
		});
	}

	return { curricula, resources };
}
