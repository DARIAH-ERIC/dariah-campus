import type { NextConfig as Config } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * File extensions and import attributes are necessary for node.js native typescript resolution with
 * `--experimental-next-config-strip-types` next.js cli option.
 */
import _redirectsIds from "#/public/redirects-ids.json" with { type: "json" };
import _redirects from "#/public/redirects.json" with { type: "json" };

const reactAriaPackages = [
	"@react-stately",
	"@react-aria",
	"@react-spectrum",
	"@adobe/react-spectrum",
	"react-stately",
	"react-aria",
	"react-aria-components",
];

const reactAriaLocales = `**/{${reactAriaPackages.join(",")}}/**/??-??.{js,cjs,mjs,json}`;

const config: Config = {
	allowedDevOrigins: ["127.0.0.1"],
	cacheComponents: true,
	experimental: {
		globalNotFound: true,
		turbopackRustReactCompiler: true,
	},
	logging: {
		browserToTerminal: true,
		fetches: {
			hmrRefreshes: true,
			fullUrl: true,
		},
	},
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
			[reactAriaLocales]: {
				condition: { all: ["foreign", "browser"] },
				loaders: ["./configs/turbopack/empty-locale-module-loader.cjs"],
				as: "*.js",
			},
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
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
