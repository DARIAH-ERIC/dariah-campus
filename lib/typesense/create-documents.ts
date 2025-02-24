import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { createReader } from "@keystatic/core/reader";

import type { Locale } from "@/config/i18n.config";
import config from "@/keystatic.config";
import { getLanguage } from "@/lib/i18n/get-language";

export async function createDocuments(locale: Locale) {
	const reader = createReader(process.cwd(), config);

	const collections = [
		"resources-events",
		"resources-external",
		"resources-hosted",
		"resources-pathfinders",
		"curricula",
	] as const;

	const documents: Array<object> = [];

	for (const name of collections) {
		const items = await reader.collections[withI18nPrefix(name, getLanguage(locale))].all();

		if (items.length === 0) continue;

		items.forEach((item) => {
			const isDraft = "draft" in item.entry && item.entry.draft === true;
			if (isDraft) return;

			const authors = "authors" in item.entry ? item.entry.authors : [];
			const editors = "editors" in item.entry ? item.entry.editors : [];
			const contributors = "contributors" in item.entry ? item.entry.contributors : [];

			documents.push({
				id: item.slug,
				collection: name,
				title: item.entry.summary.title || item.entry.title,
				locale: item.entry.locale,
				"publication-date": item.entry["publication-date"],
				"publication-timestamp": new Date(item.entry["publication-date"]).getTime(),
				"content-type":
					"content-type" in item.entry
						? item.entry["content-type"]
						: name === "curricula"
							? "curriculum"
							: name === "resources-events"
								? "event"
								: "pathfinder",
				summary: item.entry.summary.content,
				"summary-title": item.entry.summary.title,
				tags: item.entry.tags,
				people: [...authors, ...editors, ...contributors],
				authors,
				editors,
				contributors,
				sources: "sources" in item.entry ? item.entry.sources : [],
			});
		});
	}

	return documents;
}
