import localesPlugin from "@react-aria/optimize-locales-plugin";
import type { NextConfig as Config } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import _redirects from "@/public/redirects.json";
import _redirectsIds from "@/public/redirects-ids.json";

import { env } from "./config/env.config";

const config: Config = {
	allowedDevOrigins: ["127.0.0.1"],
	/** Compression should be handled by the `nginx` reverse proxy. */
	compress: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		browserDebugInfoInTerminal: true,
		globalNotFound: true,
		optimizeRouterScrolling: true,
		reactCompiler: true,
	},
	headers() {
		const headers: Awaited<ReturnType<NonNullable<Config["headers"]>>> = [
			/** @see https://nextjs.org/docs/app/guides/self-hosting#streaming-and-suspense */
			{ source: "/:path*{/}?", headers: [{ key: "x-accel-buffering", value: "no" }] },
		];

		return Promise.resolve(headers);
	},
	output: env.BUILD_MODE,
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
	typedRoutes: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack(config, { isServer }) {
		// TODO: This does not work with turbopack yet.
		/** @see https://react-spectrum.adobe.com/react-aria/ssr.html#nextjs-app-router */
		if (!isServer) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			config.plugins.push(localesPlugin.webpack({ locales: [] }));
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config;
	},
};

const plugins: Array<(config: Config) => Config> = [
	createNextIntlPlugin({
		experimental: {
			/** @see https://next-intl.dev/docs/workflows/typescript#messages-arguments */
			createMessagesDeclaration: ["./content/en/metadata/index.json", "./messages/en.json"],
		},
		requestConfig: "./lib/i18n/request.ts",
	}),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
