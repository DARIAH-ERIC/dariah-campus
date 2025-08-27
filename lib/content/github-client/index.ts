import "server-nodejs-only";

import { assert, createUrl } from "@acdh-oeaw/lib";
import { createGitHubReader } from "@keystatic/core/reader/github";
import { evaluate, type ProcessorOptions } from "@mdx-js/mdx";
import type { MDXContent } from "mdx/types";
import { cookies } from "next/headers";
import { cache } from "react";
import * as runtime from "react/jsx-runtime";

import { env } from "@/config/env.config";
import { client } from "@/lib/content/client";
import type { Curriculum } from "@/lib/content/client/curricula";
import type { Documentation } from "@/lib/content/client/documentation";
import type { IndexPage } from "@/lib/content/client/index-page";
import type { Person } from "@/lib/content/client/people";
import type { EventResource } from "@/lib/content/client/resources/events";
import type { ExternalResource } from "@/lib/content/client/resources/external";
import type { HostedResource } from "@/lib/content/client/resources/hosted";
import type { PathfinderResource } from "@/lib/content/client/resources/pathfinders";
import type { Source } from "@/lib/content/client/sources";
import type { Tag } from "@/lib/content/client/tags";
import { config } from "@/lib/content/keystatic/config";
import { createBaseConfig, createFullConfig } from "@/lib/content/mdx-compiler";
import { useMDXComponents } from "@/lib/content/mdx-components";
import { defaultLocale } from "@/lib/i18n/locales";

const locale = defaultLocale;
const baseConfig = createBaseConfig(locale);
const _fullConfig = createFullConfig(locale);

type CompileOptions = Pick<
	ProcessorOptions,
	"baseUrl" | "recmaPlugins" | "rehypePlugins" | "remarkPlugins" | "remarkRehypeOptions"
>;

type MDXModule<TNamedExports = never> = TNamedExports & {
	default: MDXContent;
};

function compile<TNamedExports = never>(
	value: string,
	config: CompileOptions,
): Promise<MDXModule<TNamedExports>> {
	return evaluate(
		{ value },
		{
			...config,
			...runtime,
			// baseUrl,
			format: "mdx",
			// @ts-expect-error FIXME: type error probably because of ReactNode return type
			useMDXComponents,
		},
	) as Promise<MDXModule<TNamedExports>>;
}

export const createGitHubClient = cache(async function createGitHubClient() {
	const owner = env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER;
	const repo = env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME;

	assert(owner != null && repo != null, "Missing github repository config.");

	const cookieStore = await cookies();

	const branch = cookieStore.get("ks-branch")?.value;
	const token = cookieStore.get("keystatic-gh-access-token")?.value;

	assert(branch, "Missing github branch.");
	assert(token, "Missing github access token.");

	const reader = createGitHubReader(config, {
		repo: `${owner}/${repo}`,
		ref: branch,
		token,
	});

	const createGitHubUrl = function createGitHubUrl(src: string) {
		assert(src.startsWith("/"), "Only images in the public folder are supported.");

		return String(
			createUrl({
				baseUrl: "https://raw.githubusercontent.com",
				pathname: `/${owner}/${repo}/refs/heads/${branch}/public${src}`,
			}),
		);
	};

	const indexPage = {
		async get(): Promise<IndexPage> {
			const data = await reader.singletons["en:index-page"].readOrThrow({
				resolveLinkedFiles: true,
			});

			const faqSection = data["faq-section"];
			const faqs = [];

			// TODO: p-limit for concurrency
			for (const faq of faqSection.faq) {
				const { default: component } = await compile(faq.content, baseConfig);

				faqs.push({ ...faq, content: component });
			}

			const aboutSection = data["about-section"];
			const aboutSectionVideos = [];

			// TODO: p-limit for concurrency
			for (const video of aboutSection.videos) {
				const image = createGitHubUrl(video.image);

				aboutSectionVideos.push({ ...video, image });
			}

			const browseSection = data["browse-section"];
			const browseSectionLinks = [];

			// TODO: p-limit for concurrency
			for (const link of browseSection.links) {
				const image = createGitHubUrl(link.image);

				browseSectionLinks.push({ ...link, image });
			}

			const testimonialSection = data["testimonial-section"];
			const testimonialSectionVideos = [];

			// TODO: p-limit for concurrency
			for (const video of testimonialSection.videos) {
				const image = createGitHubUrl(video.image);

				testimonialSectionVideos.push({ ...video, image });
			}

			const image = createGitHubUrl(data.image);

			return {
				...data,
				image,
				"faq-section": {
					...faqSection,
					faq: faqs,
				},
				"about-section": {
					...aboutSection,
					videos: aboutSectionVideos,
				},
				"browse-section": {
					...browseSection,
					links: browseSectionLinks,
				},
				"testimonial-section": {
					...testimonialSection,
					videos: testimonialSectionVideos,
				},
			};
		},
	};

	const curricula = {
		async get(id: string): Promise<Curriculum | null> {
			const data = await reader.collections["en:curricula"].read(id, { resolveLinkedFiles: true });

			if (data == null) {
				return null;
			}

			const { content, ...metadata } = data;

			const href = `/curricula/${id}`;
			const { default: component, tableOfContents } = await compile(content, baseConfig);
			const featuredImage =
				metadata["featured-image"] != null ? createGitHubUrl(metadata["featured-image"]) : null;

			// TODO: read from prebuilt client?
			const related = new Set<string>();

			return {
				id,
				content: component,
				href,
				metadata: {
					...metadata,
					"content-type": "curriculum" as const,
					"featured-image": featuredImage,
				},
				related,
				tableOfContents,
			};
		},
	};

	const documentation = {
		async get(id: string): Promise<Documentation | null> {
			const data = await reader.collections["en:documentation"].read(id, {
				resolveLinkedFiles: true,
			});

			if (data == null) {
				return null;
			}

			const { content, ...metadata } = data;

			const href = `/documentation/${id}`;
			const { default: component, tableOfContents } = await compile(content, baseConfig);

			return {
				id,
				content: component,
				href,
				metadata,
				tableOfContents,
			};
		},
	};

	const people = {
		async get(id: string): Promise<Person | null> {
			const data = await reader.collections["en:people"].read(id, {
				resolveLinkedFiles: true,
			});

			if (data == null) {
				return null;
			}

			const { content, ...metadata } = data;

			const { default: component } = await compile(content, baseConfig);
			const image = createGitHubUrl(metadata.image);

			return {
				id,
				content: component,
				metadata: {
					...metadata,
					image,
				},
			};
		},
	};

	const resourcesEvents = {
		async get(id: string): Promise<EventResource | null> {
			const data = await reader.collections["en:resources-events"].read(id, {
				resolveLinkedFiles: true,
			});

			if (data == null) {
				return null;
			}

			const { content, ...metadata } = data;

			const href = `/resources/events/${id}`;
			const { default: component, tableOfContents } = await compile(content, baseConfig);

			const sessions = [];

			// TODO: p-limit for concurrency
			for (const session of metadata.sessions) {
				const { default: component } = await compile(session.content, baseConfig);

				const presentations = [];

				// TODO: p-limit for concurrency
				for (const presentation of session.presentations) {
					const { default: component } = await compile(presentation.content, baseConfig);

					presentations.push({ ...presentation, content: component });
				}

				sessions.push({ ...session, content: component, presentations });
			}

			const featuredImage =
				metadata["featured-image"] != null ? createGitHubUrl(metadata["featured-image"]) : null;

			// TODO: read from prebuilt client?
			const curricula: Array<string> = [];

			// TODO: read from prebuilt client?
			const related = new Set<string>();

			return {
				id,
				content: component,
				href,
				kind: "event",
				metadata: {
					...metadata,
					"content-type": "event" as const,
					"featured-image": featuredImage,
					sessions,
				},
				curricula,
				related,
				tableOfContents,
			};
		},
	};

	const resourcesExternal = {
		async get(id: string): Promise<ExternalResource | null> {
			const data = await reader.collections["en:resources-external"].read(id, {
				resolveLinkedFiles: true,
			});

			if (data == null) {
				return null;
			}

			const { content, ...metadata } = data;

			const href = `/resources/external/${id}`;
			const { default: component, tableOfContents } = await compile(content, baseConfig);
			const featuredImage =
				metadata["featured-image"] != null ? createGitHubUrl(metadata["featured-image"]) : null;

			// TODO: read from prebuilt client?
			const curricula: Array<string> = [];

			// TODO: read from prebuilt client?
			const related = new Set<string>();

			return {
				id,
				content: component,
				href,
				kind: "external",
				metadata: {
					...metadata,
					"featured-image": featuredImage,
				},
				curricula,
				related,
				tableOfContents,
			};
		},
	};

	const resourcesHosted = {
		async get(id: string): Promise<HostedResource | null> {
			const data = await reader.collections["en:resources-hosted"].read(id, {
				resolveLinkedFiles: true,
			});

			if (data == null) {
				return null;
			}

			const { content, ...metadata } = data;

			const href = `/resources/hosted/${id}`;
			const { default: component, tableOfContents } = await compile(content, baseConfig);
			const featuredImage =
				metadata["featured-image"] != null ? createGitHubUrl(metadata["featured-image"]) : null;

			// TODO: read from prebuilt client?
			const curricula: Array<string> = [];

			// TODO: read from prebuilt client?
			const related = new Set<string>();

			return {
				id,
				content: component,
				href,
				kind: "hosted",
				metadata: {
					...metadata,
					"featured-image": featuredImage,
				},
				curricula,
				related,
				tableOfContents,
			};
		},
	};

	const resourcesPathfinders = {
		async get(id: string): Promise<PathfinderResource | null> {
			const data = await reader.collections["en:resources-pathfinders"].read(id, {
				resolveLinkedFiles: true,
			});

			if (data == null) {
				return null;
			}

			const { content, ...metadata } = data;

			const href = `/resources/pathfinders/${id}`;
			const { default: component, tableOfContents } = await compile(content, baseConfig);
			const featuredImage =
				metadata["featured-image"] != null ? createGitHubUrl(metadata["featured-image"]) : null;

			// TODO: read from prebuilt client?
			const curricula: Array<string> = [];

			// TODO: read from prebuilt client?
			const related = new Set<string>();

			return {
				id,
				content: component,
				href,
				kind: "pathfinder",
				metadata: {
					...metadata,
					"content-type": "pathfinder" as const,
					"featured-image": featuredImage,
				},
				curricula,
				related,
				tableOfContents,
			};
		},
	};

	const sources = {
		async get(id: string): Promise<Source | null> {
			const data = await reader.collections["en:sources"].read(id, { resolveLinkedFiles: true });

			if (data == null) {
				return null;
			}

			const { content, ...metadata } = data;

			const href = `/sources/${id}`;
			const { default: component } = await compile(content, baseConfig);
			const image = createGitHubUrl(metadata.image);

			// TODO: read from prebuilt client?
			const resources = client.collections.sources.get(id)?.resources ?? [];

			return {
				id,
				content: component,
				href,
				resources,
				metadata: {
					...metadata,
					image,
				},
			};
		},
	};

	const tags = {
		async get(id: string): Promise<Tag | null> {
			const data = await reader.collections["en:tags"].read(id, {
				resolveLinkedFiles: true,
			});

			if (data == null) {
				return null;
			}

			const { content, ...metadata } = data;

			const { default: component } = await compile(content, baseConfig);

			return {
				id,
				content: component,
				metadata,
			};
		},
	};

	return {
		collections: {
			curricula,
			documentation,
			people,
			resourcesEvents,
			resourcesExternal,
			resourcesHosted,
			resourcesPathfinders,
			sources,
			tags,
		},
		singletons: {
			indexPage,
		},
	};
});
