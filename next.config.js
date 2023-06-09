/** @typedef {import('@/i18n/i18n.config').Locale} Locale */
/** @typedef {import('next').NextConfig & {i18n?: {locales: Array<Locale>; defaultLocale: Locale}}} NextConfig */

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import createBundleAnalyzer from "@next/bundle-analyzer";
import createMdxPlugin from "@next/mdx";
import createSvgPlugin from "@stefanprobst/next-svg";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import withMdxFrontmatter from "remark-mdx-frontmatter";

const isProductionDeploy = process.env["NEXT_PUBLIC_BASE_URL"]?.startsWith(
	"https://campus.dariah.eu",
);

/** @type {NextConfig} */
const config = {
	eslint: {
		dirs: ["."],
		ignoreDuringBuilds: true,
	},
	experimental: {
		outputFileTracingExcludes: {
			"**/*": ["./content/**/*", "node_modules/**/@swc/core*"],
		},
	},
	async headers() {
		const headers = [];

		if (isProductionDeploy !== true) {
			headers.push({
				source: "/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow",
					},
				],
			});

			console.warn("⚠️ Indexing by search engines is disallowed.");
		}

		return headers;
	},
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
	output: "standalone",
	pageExtensions: ["page.tsx", "page.mdx", "api.ts"],
	poweredByHeader: false,
	async redirects() {
		return [
			...Object.entries(
				JSON.parse(
					await readFile(join(process.cwd(), "./redirects.resources.json"), { encoding: "utf-8" }),
				),
			).map(([uuid, id]) => {
				return {
					source: `/id/${uuid}`,
					destination: `/resource/posts/${id}`,
					permanent: false,
				};
			}),
			...Object.entries(
				JSON.parse(
					await readFile(join(process.cwd(), "./redirects.courses.json"), { encoding: "utf-8" }),
				),
			).map(([uuid, id]) => {
				return {
					source: `/id/${uuid}`,
					destination: `/curriculum/${id}`,
					permanent: false,
				};
			}),
			...Object.entries(
				JSON.parse(
					await readFile(join(process.cwd(), "./redirects.events.json"), { encoding: "utf-8" }),
				),
			).map(([uuid, id]) => {
				return {
					source: `/id/${uuid}`,
					destination: `/resource/events/${id}`,
					permanent: false,
				};
			}),
			...Object.entries(
				JSON.parse(
					await readFile(join(process.cwd(), "./redirects.legacy.resources.json"), {
						encoding: "utf-8",
					}),
				),
			).map(([legacyId, id]) => {
				return {
					source: `/resource/${legacyId}`,
					destination: `/resource/posts/${id}`,
					permanent: true,
				};
			}),
			...Object.entries(
				JSON.parse(
					await readFile(join(process.cwd(), "./redirects.legacy.events.json"), {
						encoding: "utf-8",
					}),
				),
			).map(([legacyId, id]) => {
				return {
					source: `/resource/${legacyId}`,
					destination: `/resource/events/${id}`,
					permanent: true,
				};
			}),
			...Object.entries(
				JSON.parse(
					await readFile(join(process.cwd(), "./redirects.legacy.persons.json"), {
						encoding: "utf-8",
					}),
				),
			).map(([legacyId, id]) => {
				return {
					source: `/author/${legacyId}`,
					destination: `/author/${id}`,
					permanent: true,
				};
			}),
		];
	},
	async rewrites() {
		return [
			{ source: "/resources", destination: "/resources/page/1" },
			{ source: "/resources/:type", destination: "/resources/:type/page/1" },
			{ source: "/courses", destination: "/courses/page/1" },
			{ source: "/authors", destination: "/authors/page/1" },
			{ source: "/author/:id", destination: "/author/:id/page/1" },
			{ source: "/tags", destination: "/tags/page/1" },
			{ source: "/tag/:id", destination: "/tag/:id/page/1" },
			{ source: "/categories", destination: "/categories/page/1" },
			{ source: "/category/:id", destination: "/category/:id/page/1" },
			{ source: "/about", destination: "/docs/about" },
		];
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
	createBundleAnalyzer({ enabled: process.env.BUNDLE_ANALYZER === "enabled" }),
	createMdxPlugin({
		extension: /\.mdx?/,
		options: {
			remarkPlugins: [withFrontmatter, withMdxFrontmatter, withGfm],
		},
	}),
	createSvgPlugin({}),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
