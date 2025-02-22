import { assert, createUrl, keyByToMap } from "@acdh-oeaw/lib";
import { getFormatter } from "next-intl/server";
import { type Entry, rss } from "xast-util-feed";
import { toXml } from "xast-util-to-xml";

import { createResourceUrl } from "@/app/(app)/resources/_lib/create-resource-url";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/config/i18n.config";
import { createClient } from "@/lib/content/create-client";
import { createFullUrl } from "@/lib/create-full-url";
import { getMetadata } from "@/lib/i18n/get-metadata";

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;
const locale = defaultLocale;

export async function createFeed() {
	const meta = await getMetadata(locale);
	const format = await getFormatter({ locale });

	const channel = {
		title: meta.title,
		url: baseUrl,
		feedUrl: String(createUrl({ baseUrl, pathname: "/rss.xml" })),
		lang: locale,
	};

	const entries: Array<Entry> = [];

	const client = await createClient(locale);

	const curricula = await client.curricula.all();
	const resources = await client.resources.all();
	const people = await client.people.all();
	const tags = await client.tags.all();
	const peopleById = keyByToMap(people, (person) => {
		return person.id;
	});
	const tagsById = keyByToMap(tags, (tag) => {
		return tag.id;
	});

	resources.forEach((resource) => {
		const authors = resource.data.authors.map((id) => {
			const person = peopleById.get(id);
			assert(person, `Missing person "${id}".`);
			return person.data.name;
		});

		const tags = resource.data.tags.map((id) => {
			const tag = tagsById.get(id);
			assert(tag, `Missing tag "${id}".`);
			return tag.data.name;
		});

		const url = String(createFullUrl({ pathname: createResourceUrl(resource) }));

		entries.push({
			title: resource.data.title,
			description: resource.data.summary.content,
			published: resource.data["publication-date"],
			author: format.list(authors),
			tags,
			url,
		});
	});

	curricula.forEach((curriculum) => {
		const editors = curriculum.data.editors.map((id) => {
			const person = peopleById.get(id);
			assert(person, `Missing person "${id}".`);
			return person.data.name;
		});

		const tags = curriculum.data.tags.map((id) => {
			const tag = tagsById.get(id);
			assert(tag, `Missing tag "${id}".`);
			return tag.data.name;
		});

		const url = String(createFullUrl({ pathname: `/curricula/${curriculum.id}` }));

		entries.push({
			title: curriculum.data.title,
			description: curriculum.data.summary.content,
			published: curriculum.data["publication-date"],
			author: format.list(editors),
			tags,
			url,
		});
	});

	const feed = toXml(rss(channel, entries));

	return feed;
}
