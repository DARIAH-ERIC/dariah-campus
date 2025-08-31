import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { config as createConfig } from "@keystatic/core";

import { env } from "@/config/env.config";
import { createCurricula } from "@/lib/content/keystatic/collections/curricula";
import { createDocumentation } from "@/lib/content/keystatic/collections/documentation";
import { createPeople } from "@/lib/content/keystatic/collections/people";
import { createResourcesEvents } from "@/lib/content/keystatic/collections/resources/events";
import { createResourcesExternal } from "@/lib/content/keystatic/collections/resources/external";
import { createResourcesHosted } from "@/lib/content/keystatic/collections/resources/hosted";
import { createResourcesPathfinders } from "@/lib/content/keystatic/collections/resources/pathfinders";
import { createSources } from "@/lib/content/keystatic/collections/sources";
import { createTags } from "@/lib/content/keystatic/collections/tags";
import { Logo } from "@/lib/content/keystatic/logo";
import { createIndexPage } from "@/lib/content/keystatic/singletons/index-page";
import { createMetadata } from "@/lib/content/keystatic/singletons/metadata";
import { createNavigation } from "@/lib/content/keystatic/singletons/navigation";
import { defaultLocale, getIntlLanguage } from "@/lib/i18n/locales";

const locale = getIntlLanguage(defaultLocale);

export const config = createConfig({
	collections: {
		[withI18nPrefix("curricula", locale)]: createCurricula(locale),
		[withI18nPrefix("documentation", locale)]: createDocumentation(locale),
		[withI18nPrefix("resources-events", locale)]: createResourcesEvents(locale),
		[withI18nPrefix("people", locale)]: createPeople(locale),
		[withI18nPrefix("resources-external", locale)]: createResourcesExternal(locale),
		[withI18nPrefix("resources-hosted", locale)]: createResourcesHosted(locale),
		[withI18nPrefix("resources-pathfinders", locale)]: createResourcesPathfinders(locale),
		[withI18nPrefix("sources", locale)]: createSources(locale),
		[withI18nPrefix("tags", locale)]: createTags(locale),
	},
	singletons: {
		[withI18nPrefix("index-page", locale)]: createIndexPage(locale),
		[withI18nPrefix("metadata", locale)]: createMetadata(locale),
		[withI18nPrefix("navigation", locale)]: createNavigation(locale),
	},
	storage:
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER != null &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME != null
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
			mark: Logo,
			name: "DARIAH-Campus",
		},
		navigation: {
			Content: [
				withI18nPrefix("resources-hosted", locale),
				withI18nPrefix("resources-external", locale),
				withI18nPrefix("resources-pathfinders", locale),
				withI18nPrefix("resources-events", locale),
				withI18nPrefix("curricula", locale),
			],
			Data: [
				withI18nPrefix("people", locale),
				withI18nPrefix("sources", locale),
				withI18nPrefix("tags", locale),
			],
			Pages: [withI18nPrefix("index-page", locale), withI18nPrefix("documentation", locale)],
			Settings: [withI18nPrefix("navigation", locale), withI18nPrefix("metadata", locale)],
		},
	},
});
