import createBundleAnalyzer from "@next/bundle-analyzer";
import localesPlugin from "@react-aria/optimize-locales-plugin";
import type { NextConfig } from "next";
import createI18nPlugin from "next-intl/plugin";

import { env } from "@/config/env.config";
import _redirects from "@/public/redirects.json";
import _redirectsIds from "@/public/redirects-ids.json";

const config: NextConfig = {
	/** Compression should be handled by nginx reverse proxy. */
	compress: false,
	eslint: {
		dirs: [process.cwd()],
		ignoreDuringBuilds: true,
	},
	// experimental: {
	// 	dynamicIO: true,
	// 	ppr: true,
	// },
	headers() {
		const headers: Awaited<ReturnType<NonNullable<NextConfig["headers"]>>> = [
			/** @see https://nextjs.org/docs/app/building-your-application/deploying#streaming-and-suspense */
			{
				source: "/:path*{/}?",
				headers: [
					{
						key: "X-Accel-Buffering",
						value: "no",
					},
				],
			},
		];

		return Promise.resolve(headers);
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	outputFileTracingExcludes: {
		"**/*": [
			"./content/**/*",
			"./public/assets/content/**/*",
			"./node_modules/.pnpm/@shikijs+langs/**/*",
		],
	},
	redirects() {
		const redirects: Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>> = [
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
		const rewrites: Awaited<ReturnType<NonNullable<NextConfig["rewrites"]>>> = [
			{
				source: "/documentation",
				destination: "/documentation/about",
			},
		];

		return Promise.resolve(rewrites);
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack(config, { isServer }) {
		/**
		 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#nextjs-app-router
		 */
		if (!isServer) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			config.plugins.push(localesPlugin.webpack({ locales: [] }));
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config;
	},
};

const plugins: Array<(config: NextConfig) => NextConfig> = [
	createBundleAnalyzer({ enabled: env.BUNDLE_ANALYZER === "enabled" }),
	createI18nPlugin({
		experimental: {
			/** @see https://v4.next-intl.dev/docs/workflows/typescript#messages-arguments */
			createMessagesDeclaration: ["./content/en/metadata/index.json", "./messages/en.json"],
		},
		requestConfig: "./lib/i18n/get-request-config.ts",
	}),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
