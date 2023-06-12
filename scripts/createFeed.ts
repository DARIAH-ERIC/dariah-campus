import generateFeed from "@stefanprobst/next-feed";

import { getPostPreviews } from "@/cms/api/posts.api";
import { getFullName } from "@/cms/utils/getFullName";
import { defaultLocale, locales } from "@/i18n/i18n.config";
import { routes } from "@/navigation/routes.config";
import { createUrl } from "@/utils/createUrl";
import { log } from "@/utils/log";
import { feedFileName as fileName, url as siteUrl } from "~/config/site.config";
import { siteMetadata } from "~/config/siteMetadata.config";

const MAX_ENTRIES_PER_CHANNEL = 20;

/**
 * Generates RSS `feed.xml`.
 */
async function generate() {
	const resourcesByLocale = await Promise.all(
		locales.map((locale) => {
			return getPostPreviews(locale);
		}),
	);

	const resources = resourcesByLocale.flat().slice(0, MAX_ENTRIES_PER_CHANNEL);
	const metadata = siteMetadata[defaultLocale];

	const channel = {
		title: metadata.title,
		url: siteUrl, // metadata.url
		feedUrl: String(createUrl({ pathname: fileName, baseUrl: siteUrl })),
		description: metadata.description,
		// lang: locale,
		author: metadata.creator?.name,
		tags: ["Digital Humanities"],
	};

	const entries = resources.map((resource) => {
		return {
			title: resource.title,
			url: String(
				createUrl({
					...routes.resource({ kind: "posts", id: resource.id }),
					baseUrl: siteUrl,
				}),
			),
			description: resource.abstract,
			author: resource.authors
				.map((author) => {
					return getFullName(author);
				})
				.join(", "),
			published: resource.date,
			tags: resource.tags.map((tag) => {
				return tag.name;
			}),
		};
	});

	// @ts-expect-error Package misconfigured for ESM.
	return generateFeed.default({
		fileName,
		channel,
		entries,
	});
}

generate()
	.then(() => {
		log.success("Successfully generated RSS feed.");
	})
	.catch(log.error);
