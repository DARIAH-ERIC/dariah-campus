import { addTrailingSlash, removeTrailingSlash } from "@acdh-oeaw/lib";
import * as v from "valibot";

import { define } from "#/lib/env/index.ts";

const validate = define({
	buildArgsPrefix: "NEXT_PUBLIC_",
	buildArgs: v.object({
		NEXT_PUBLIC_APP_BASE_URL: v.optional(
			v.pipe(v.string(), v.url(), v.transform(removeTrailingSlash)),
			`https://${String(process.env.NEXT_PUBLIC_VERCEL_URL)}`,
		),
		NEXT_PUBLIC_APP_PRODUCTION_BASE_URL: v.optional(
			v.pipe(v.string(), v.url(), v.transform(removeTrailingSlash)),
			`https://${String(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL)}`,
		),
		NEXT_PUBLIC_APP_BOTS: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
		NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION: v.optional(v.pipe(v.string(), v.nonEmpty())),
		NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: v.optional(v.pipe(v.string(), v.nonEmpty())),
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: v.optional(v.pipe(v.string(), v.nonEmpty())),
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: v.optional(v.pipe(v.string(), v.nonEmpty())),
		NEXT_PUBLIC_KEYSTATIC_MODE: v.optional(v.picklist(["github", "local"]), "local"),
		NEXT_PUBLIC_APP_MATOMO_BASE_URL: v.optional(v.pipe(v.string(), v.url(), v.transform(addTrailingSlash))),
		NEXT_PUBLIC_APP_MATOMO_ID: v.optional(v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1))),
		NEXT_PUBLIC_TYPESENSE_COLLECTION: v.pipe(v.string(), v.nonEmpty()),
		NEXT_PUBLIC_TYPESENSE_HOST: v.pipe(v.string(), v.nonEmpty()),
		NEXT_PUBLIC_TYPESENSE_PORT: v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1)),
		NEXT_PUBLIC_TYPESENSE_PROTOCOL: v.optional(v.picklist(["http", "https"]), "https"),
		/**
		 * Optional, because we need to be able to create a collection, before we create a search-only api key for that
		 * collection.
		 */
		NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY: v.optional(v.pipe(v.string(), v.nonEmpty())),
	}),
	envVars: v.object({
		BUILD_MODE: v.optional(v.picklist(["export", "standalone"])),
		CI: v.optional(v.pipe(v.unknown(), v.toBoolean())),
		HANDLE_CERT: v.optional(v.pipe(v.string(), v.nonEmpty())),
		HANDLE_KEY: v.optional(v.pipe(v.string(), v.nonEmpty())),
		HANDLE_PREFIX: v.optional(v.pipe(v.string(), v.nonEmpty())),
		HANDLE_PROVIDER: v.optional(v.pipe(v.string(), v.url())),
		HANDLE_RESOLVER: v.optional(v.pipe(v.string(), v.url())),
		KEYSTATIC_GITHUB_CLIENT_ID: v.optional(v.pipe(v.string(), v.nonEmpty())),
		KEYSTATIC_GITHUB_CLIENT_SECRET: v.optional(v.pipe(v.string(), v.nonEmpty())),
		KEYSTATIC_SECRET: v.optional(v.pipe(v.string(), v.nonEmpty())),
		NEXT_RUNTIME: v.optional(v.picklist(["edge", "nodejs"])),
		PORT: v.optional(v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1))),
		TYPESENSE_ADMIN_API_KEY: v.pipe(v.string(), v.nonEmpty()),
		VERCEL_ENV: v.optional(v.pipe(v.string(), v.nonEmpty())),
		VERCEL_GIT_COMMIT_REF: v.optional(v.pipe(v.string(), v.nonEmpty())),
	}),
});

export const env = validate({
	environment: {
		BUILD_MODE: process.env.BUILD_MODE,
		CI: process.env.CI,
		HANDLE_CERT: process.env.HANDLE_CERT,
		HANDLE_KEY: process.env.HANDLE_KEY,
		HANDLE_PREFIX: process.env.HANDLE_PREFIX,
		HANDLE_PROVIDER: process.env.HANDLE_PROVIDER,
		HANDLE_RESOLVER: process.env.HANDLE_RESOLVER,
		KEYSTATIC_GITHUB_CLIENT_ID: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
		KEYSTATIC_GITHUB_CLIENT_SECRET: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
		KEYSTATIC_SECRET: process.env.KEYSTATIC_SECRET,
		NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
		NEXT_PUBLIC_APP_PRODUCTION_BASE_URL: process.env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL,
		NEXT_PUBLIC_APP_BOTS: process.env.NEXT_PUBLIC_APP_BOTS,
		NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
		NEXT_PUBLIC_KEYSTATIC_MODE: process.env.NEXT_PUBLIC_KEYSTATIC_MODE,
		NEXT_PUBLIC_APP_MATOMO_BASE_URL: process.env.NEXT_PUBLIC_APP_MATOMO_BASE_URL,
		NEXT_PUBLIC_APP_MATOMO_ID: process.env.NEXT_PUBLIC_APP_MATOMO_ID,
		NEXT_PUBLIC_TYPESENSE_COLLECTION: process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION,
		NEXT_PUBLIC_TYPESENSE_HOST: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
		NEXT_PUBLIC_TYPESENSE_PORT: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
		NEXT_PUBLIC_TYPESENSE_PROTOCOL: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
		NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY,
		NEXT_RUNTIME: process.env.NEXT_RUNTIME,
		PORT: process.env.PORT,
		TYPESENSE_ADMIN_API_KEY: process.env.TYPESENSE_ADMIN_API_KEY,
		VERCEL_ENV: process.env.VERCEL_ENV,
		VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
	},
}).unwrap();
