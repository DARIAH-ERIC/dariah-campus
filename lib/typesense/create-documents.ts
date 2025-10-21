import { unique } from "@acdh-oeaw/lib";

import { client } from "@/lib/content/client";

export async function createDocuments(): Promise<Array<object>> {
	const documents: Array<object> = [];

	for (const name of [
		"resourcesEvents",
		"resourcesExternal",
		"resourcesHosted",
		"resourcesPathfinders",
		"curricula",
	] as const) {
		await Promise.all(
			(await client.collections[name].all()).map((item) => {
				const isDraft = "draft" in item.metadata && item.metadata.draft === true;
				if (isDraft) return;

				const authors = "authors" in item.metadata ? item.metadata.authors : [];
				const editors = "editors" in item.metadata ? item.metadata.editors : [];
				const contributors = "contributors" in item.metadata ? item.metadata.contributors : [];

				documents.push({
					id: item.id,
					collection: name,
					href: item.href,
					title: item.metadata.summary.title || item.metadata.title,
					locale: item.metadata.locale,
					"publication-date": item.metadata["publication-date"],
					"publication-timestamp": new Date(item.metadata["publication-date"]).getTime(),
					"content-type": item.metadata["content-type"],
					summary: item.metadata.summary.content,
					"summary-title": item.metadata.summary.title,
					tags: item.metadata.tags,
					people: unique([...authors, ...editors, ...contributors]),
					authors,
					editors,
					contributors,
					sources: "sources" in item.metadata ? item.metadata.sources : [],
				});
			}),
		);
	}

	return documents;
}
