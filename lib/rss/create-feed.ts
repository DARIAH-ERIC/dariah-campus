import { assert, createUrl, keyByToMap } from "@acdh-oeaw/lib";
import { getFormatter } from "next-intl/server";
import { type Entry, rss } from "xast-util-feed";
import { toXml } from "xast-util-to-xml";

import { env } from "@/config/env.config";
import { client } from "@/lib/content/client";
import { defaultLocale } from "@/lib/i18n/locales";
import { getMetadata } from "@/lib/i18n/metadata";
import { createFullUrl } from "@/lib/navigation/create-full-url";

const baseUrl = env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL;
const locale = defaultLocale;

export async function createFeed(): Promise<string> {
	const meta = await getMetadata(locale);
	const format = await getFormatter({ locale });

	const channel = {
		title: meta.title,
		url: baseUrl,
		feedUrl: String(createUrl({ baseUrl, pathname: "/rss.xml" })),
		lang: locale,
	};

	const entries: Array<Entry> = [];

	const curricula = client.collections.curricula.all();
	const resources = client.collections.resources.all();
	const people = client.collections.people.all();
	const tags = client.collections.tags.all();
	const peopleById = keyByToMap(people, (person) => {
		return person.id;
	});
	const tagsById = keyByToMap(tags, (tag) => {
		return tag.id;
	});

	resources.forEach((resource) => {
		const authors = resource.metadata.authors.map((id) => {
			const person = peopleById.get(id);
			assert(person, `Missing person "${id}".`);
			return person.metadata.name;
		});

		const tags = resource.metadata.tags.map((id) => {
			const tag = tagsById.get(id);
			assert(tag, `Missing tag "${id}".`);
			return tag.metadata.name;
		});

		const url = String(createFullUrl({ pathname: resource.href }));

		entries.push({
			title: resource.metadata.title,
			description: resource.metadata.summary.content,
			published: resource.metadata["publication-date"],
			author: format.list(authors),
			tags,
			url,
		});
	});

	curricula.forEach((curriculum) => {
		const editors = curriculum.metadata.editors.map((id) => {
			const person = peopleById.get(id);
			assert(person, `Missing person "${id}".`);
			return person.metadata.name;
		});

		const tags = curriculum.metadata.tags.map((id) => {
			const tag = tagsById.get(id);
			assert(tag, `Missing tag "${id}".`);
			return tag.metadata.name;
		});

		const url = String(createFullUrl({ pathname: curriculum.href }));

		entries.push({
			title: curriculum.metadata.title,
			description: curriculum.metadata.summary.content,
			published: curriculum.metadata["publication-date"],
			author: format.list(editors),
			tags,
			url,
		});
	});

	const feed = toXml(rss(channel, entries));

	return feed;
}
