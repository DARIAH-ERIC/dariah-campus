import type { NextConfig as Config } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * File extensions and import attributes are necessary for node.js native typescript resolution
 * with `--experimental-next-config-strip-types` next.js cli option.
 */
import { env } from "./config/env.config.ts";
import _redirects from "./public/redirects.json" with { type: "json" };
import _redirectsIds from "./public/redirects-ids.json" with { type: "json" };

const config: Config = {
	allowedDevOrigins: ["127.0.0.1"],
	/** Compression should be handled by the `nginx` reverse proxy. */
	compress: false,
	experimental: {
		browserDebugInfoInTerminal: true,
		globalNotFound: true,
	},
	headers() {
		const headers: Awaited<ReturnType<NonNullable<Config["headers"]>>> = [
			/** @see https://nextjs.org/docs/app/guides/self-hosting#streaming-and-suspense */
			{ source: "/:path*{/}?", headers: [{ key: "x-accel-buffering", value: "no" }] },
		];

		return Promise.resolve(headers);
	},
	output: env.BUILD_MODE,
	outputFileTracingIncludes: {
		"**/*": ["./public/assets/fonts/*.ttf"],
	},
	reactCompiler: true,
	redirects() {
		const redirects: Awaited<ReturnType<NonNullable<Config["redirects"]>>> = [
			{
				source: "/admin",
				destination: "/keystatic",
				permanent: false,
			},
			{
				source: "/api/metadata/:path*",
				destination: "/api/v1/metadata/:path*",
				permanent: false,
			},
			..._redirects.redirects,
			..._redirects.redirects.map((redirect) => {
				return {
					...redirect,
					source: `/en${redirect.source}`,
				};
			}),
			..._redirectsIds.redirects,
		];

		return Promise.resolve(redirects);
	},
	rewrites() {
		const rewrites: Awaited<ReturnType<NonNullable<Config["rewrites"]>>> = [
			{
				source: "/documentation",
				destination: "/documentation/about",
			},
		];

		return Promise.resolve(rewrites);
	},
	turbopack: {
		rules: {
			/** @see {@link https://github.com/vercel/next.js/discussions/77721#discussioncomment-14576268} */
			"*": {
				condition: {
					all: [
						"foreign",
						"browser",
						{
							path: /(@react-stately|@react-aria|@react-spectrum|react-aria-components)\/.*\/[a-z]{2}-[A-Z]{2}/,
						},
					],
				},
				loaders: ["null-loader"],
				as: "*.js",
			},
		},
	},
	typedRoutes: true,
	typescript: {
		ignoreBuildErrors: true,
	},
};

const plugins: Array<(config: Config) => Config> = [
	createNextIntlPlugin({
		experimental: {
			/** @see {@link https://next-intl.dev/docs/workflows/typescript#messages-arguments} */
			createMessagesDeclaration: ["./content/en/metadata/index.json", "./messages/en.json"],
		},
		requestConfig: "./lib/i18n/request.ts",
	}),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
