import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { config } from "@keystatic/core";

import { Logo } from "@/components/logo";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/config/i18n.config";
import { getLanguage } from "@/lib/i18n/get-language";
import {
	createCurricula,
	createDocumentation,
	createEvents,
	createPeople,
	createResourcesExternal,
	createResourcesHosted,
	createResourcesPathfinders,
	createSources,
	createTags,
} from "@/lib/keystatic/collections";
import { createIndexPage, createMetadata, createNavigation } from "@/lib/keystatic/singletons";

const defaultLanguage = getLanguage(defaultLocale);

export default config({
	collections: {
		[withI18nPrefix("curricula", defaultLanguage)]: createCurricula(defaultLanguage),
		[withI18nPrefix("documentation", defaultLanguage)]: createDocumentation(defaultLanguage),
		[withI18nPrefix("resources-events", defaultLanguage)]: createEvents(defaultLanguage),
		[withI18nPrefix("people", defaultLanguage)]: createPeople(defaultLanguage),
		[withI18nPrefix("resources-external", defaultLanguage)]:
			createResourcesExternal(defaultLanguage),
		[withI18nPrefix("resources-hosted", defaultLanguage)]: createResourcesHosted(defaultLanguage),
		[withI18nPrefix("resources-pathfinders", defaultLanguage)]:
			createResourcesPathfinders(defaultLanguage),
		[withI18nPrefix("sources", defaultLanguage)]: createSources(defaultLanguage),
		[withI18nPrefix("tags", defaultLanguage)]: createTags(defaultLanguage),
	},
	singletons: {
		[withI18nPrefix("index-page", defaultLanguage)]: createIndexPage(defaultLanguage),
		[withI18nPrefix("metadata", defaultLanguage)]: createMetadata(defaultLanguage),
		[withI18nPrefix("navigation", defaultLanguage)]: createNavigation(defaultLanguage),
	},
	storage:
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark() {
				return <Logo />;
			},
			name: "DARIAH-Campus",
		},
		navigation: {
			Content: [
				withI18nPrefix("resources-hosted", defaultLanguage),
				withI18nPrefix("resources-external", defaultLanguage),
				withI18nPrefix("resources-pathfinders", defaultLanguage),
				withI18nPrefix("resources-events", defaultLanguage),
				withI18nPrefix("curricula", defaultLanguage),
			],
			Data: [
				withI18nPrefix("people", defaultLanguage),
				withI18nPrefix("sources", defaultLanguage),
				withI18nPrefix("tags", defaultLanguage),
			],
			Pages: [
				withI18nPrefix("index-page", defaultLanguage),
				withI18nPrefix("documentation", defaultLanguage),
			],
			Metadata: [
				withI18nPrefix("navigation", defaultLanguage),
				withI18nPrefix("metadata", defaultLanguage),
			],
		},
	},
});
