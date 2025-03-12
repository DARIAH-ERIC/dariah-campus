/* eslint-disable no-restricted-syntax */

import { log } from "@acdh-oeaw/lib";
import { createEnv } from "@acdh-oeaw/validate-env/next";
import * as v from "valibot";

export const env = createEnv({
	system(input) {
		const Schema = v.object({
			NODE_ENV: v.optional(v.picklist(["development", "production", "test"]), "production"),
		});

		return v.parse(Schema, input);
	},
	private(input) {
		const Schema = v.object({
			BUILD_MODE: v.optional(v.picklist(["export", "standalone"])),
			BUNDLE_ANALYZER: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
			CI: v.optional(v.pipe(v.unknown(), v.transform(Boolean), v.boolean())),
			HANDLE_PASSWORD: v.optional(v.pipe(v.string(), v.nonEmpty())),
			HANDLE_PREFIX: v.optional(v.pipe(v.string(), v.nonEmpty()), "21.11159"),
			HANDLE_PROVIDER: v.optional(v.pipe(v.string(), v.url()), "http://pid.gwdg.de/handles/"),
			HANDLE_RESOLVER: v.optional(v.pipe(v.string(), v.url()), "https://hdl.handle.net/"),
			HANDLE_USERNAME: v.optional(v.pipe(v.string(), v.nonEmpty())),
			KEYSTATIC_GITHUB_CLIENT_ID: v.optional(v.pipe(v.string(), v.nonEmpty())),
			KEYSTATIC_GITHUB_CLIENT_SECRET: v.optional(v.pipe(v.string(), v.nonEmpty())),
			KEYSTATIC_SECRET: v.optional(v.pipe(v.string(), v.nonEmpty())),
			TYPESENSE_ADMIN_API_KEY: v.optional(v.pipe(v.string(), v.nonEmpty())),
			VERCEL_ENV: v.optional(v.pipe(v.string(), v.nonEmpty())),
			VERCEL_GIT_COMMIT_REF: v.optional(v.pipe(v.string(), v.nonEmpty())),
		});

		return v.parse(Schema, input);
	},
	public(input) {
		const Schema = v.object({
			NEXT_PUBLIC_APP_BASE_URL: v.optional(
				v.pipe(v.string(), v.url()),
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				`https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
			),
			NEXT_PUBLIC_BOTS: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
			NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: v.optional(v.string()),
			NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: v.optional(v.pipe(v.string(), v.nonEmpty())),
			NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: v.optional(v.pipe(v.string(), v.nonEmpty())),
			NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: v.optional(v.pipe(v.string(), v.nonEmpty())),
			NEXT_PUBLIC_KEYSTATIC_MODE: v.optional(v.picklist(["github", "local"]), "local"),
			NEXT_PUBLIC_MATOMO_BASE_URL: v.optional(v.pipe(v.string(), v.url())),
			NEXT_PUBLIC_MATOMO_ID: v.optional(
				v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)),
			),
			NEXT_PUBLIC_REDMINE_ID: v.pipe(
				v.string(),
				v.transform(Number),
				v.number(),
				v.integer(),
				v.minValue(1),
			),
			NEXT_PUBLIC_TYPESENSE_COLLECTION: v.pipe(v.string(), v.nonEmpty()),
			NEXT_PUBLIC_TYPESENSE_HOST: v.pipe(v.string(), v.nonEmpty()),
			NEXT_PUBLIC_TYPESENSE_PORT: v.pipe(
				v.string(),
				v.transform(Number),
				v.number(),
				v.integer(),
				v.minValue(1),
			),
			NEXT_PUBLIC_TYPESENSE_PROTOCOL: v.picklist(["http", "https"]),
			NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY: v.optional(v.pipe(v.string(), v.nonEmpty())),
		});

		return v.parse(Schema, input);
	},
	environment: {
		BUILD_MODE: process.env.BUILD_MODE,
		BUNDLE_ANALYZER: process.env.BUNDLE_ANALYZER,
		CI: process.env.CI,
		HANDLE_PASSWORD: process.env.HANDLE_PASSWORD,
		HANDLE_PREFIX: process.env.HANDLE_PREFIX,
		HANDLE_PROVIDER: process.env.HANDLE_PROVIDER,
		HANDLE_RESOLVER: process.env.HANDLE_RESOLVER,
		HANDLE_USERNAME: process.env.HANDLE_USERNAME,
		KEYSTATIC_GITHUB_CLIENT_ID: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
		KEYSTATIC_GITHUB_CLIENT_SECRET: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
		KEYSTATIC_SECRET: process.env.KEYSTATIC_SECRET,
		NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
		NEXT_PUBLIC_BOTS: process.env.NEXT_PUBLIC_BOTS,
		NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
		NEXT_PUBLIC_KEYSTATIC_MODE: process.env.NEXT_PUBLIC_KEYSTATIC_MODE,
		NEXT_PUBLIC_MATOMO_BASE_URL: process.env.NEXT_PUBLIC_MATOMO_BASE_URL,
		NEXT_PUBLIC_MATOMO_ID: process.env.NEXT_PUBLIC_MATOMO_ID,
		NEXT_PUBLIC_REDMINE_ID: process.env.NEXT_PUBLIC_REDMINE_ID,
		NEXT_PUBLIC_TYPESENSE_COLLECTION: process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION,
		NEXT_PUBLIC_TYPESENSE_HOST: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
		NEXT_PUBLIC_TYPESENSE_PORT: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
		NEXT_PUBLIC_TYPESENSE_PROTOCOL: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
		NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY,
		NODE_ENV: process.env.NODE_ENV,
		TYPESENSE_ADMIN_API_KEY: process.env.TYPESENSE_ADMIN_API_KEY,
		VERCEL_ENV: process.env.VERCEL_ENV,
		VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
	},
	validation: v.parse(
		v.optional(v.picklist(["disabled", "enabled", "public"]), "enabled"),
		process.env.ENV_VALIDATION,
	),
	onError(error) {
		if (error instanceof v.ValiError) {
			const message = "Invalid environment variables";

			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			log.error(`${message}:`, v.flatten(error.issues).nested);

			const validationError = new Error(message);
			delete validationError.stack;

			throw validationError;
		}

		throw error;
	},
});
