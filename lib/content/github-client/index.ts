import "server-only";

import { assert, createUrl } from "@acdh-oeaw/lib";
import { createGitHubReader } from "@keystatic/core/reader/github";
import { cache } from "react";

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
import { evaluate, type EvaluateOptions } from "@/lib/content/mdx/evaluate";
import {
	createCustomHeadingIdsPlugin,
	createHeadingIdsPlugin,
	createIframeTitlesPlugin,
	createMermaidDiagramsPlugin,
	createRemoteImageUrlsPlugin,
	createSyntaxHighlighterPlugin,
	createTableOfContentsPlugin,
	createUnwrappedMdxFlowContentPlugin,
} from "@/lib/content/mdx/rehype-plugins";
import {
	createFootnotesPlugin,
	createGitHubMarkdownPlugin,
	createTypographicQuotesPlugin,
} from "@/lib/content/mdx/remark-plugins";
import { createRemarkRehypeOptions } from "@/lib/content/mdx/remark-rehype-options";
import { defaultLocale, getIntlLanguage } from "@/lib/i18n/locales";

const locale = defaultLocale;

const createEvaluateOptions = (baseUrl: string) => {
	return {
		remarkPlugins: [
			createGitHubMarkdownPlugin(),
			createFootnotesPlugin(),
			createTypographicQuotesPlugin(getIntlLanguage(locale)),
		],
		remarkRehypeOptions: createRemarkRehypeOptions(locale),
		rehypePlugins: [
			createCustomHeadingIdsPlugin(),
			createHeadingIdsPlugin(),
			createIframeTitlesPlugin(["Embed", "Video"]),
			createMermaidDiagramsPlugin(),
			createSyntaxHighlighterPlugin(),
			createTableOfContentsPlugin(),
			createUnwrappedMdxFlowContentPlugin(["LinkButton"]),
			createRemoteImageUrlsPlugin(baseUrl, ["Figure", "VideoCard"]),
		],
	} satisfies EvaluateOptions;
};

export const createGitHubClient = cache(function createGitHubClient({
	owner,
	repo,
	branch,
	token,
}: {
	owner: string;
	repo: string;
	branch: string;
	token: string;
}) {
	const reader = createGitHubReader(config, {
		repo: `${owner}/${repo}`,
		ref: branch,
		token,
	});

	const baseUrl = "https://raw.githubusercontent.com";
	const basePath = `/${owner}/${repo}/refs/heads/${branch}`;

	const createGitHubUrl = function createGitHubUrl(src: string) {
		assert(src.startsWith("/"), "Only images in the public folder are supported.");

		const filePath = `/public${src}`;

		return String(createUrl({ baseUrl, pathname: basePath + filePath }));
	};

	const evaluateOptions = createEvaluateOptions(String(createUrl({ baseUrl, pathname: basePath })));

	const indexPage = {
		async get(): Promise<IndexPage> {
			const data = await reader.singletons["en:index-page"].readOrThrow({
				resolveLinkedFiles: true,
			});

			const faqSection = data["faq-section"];
			const faqs = [];

			// TODO: p-limit for concurrency
			for (const faq of faqSection.faq) {
				const { default: component } = await evaluate(faq.content, evaluateOptions);

				faqs.push({ ...faq, content: component });
			}

			const aboutSection = data["about-section"];
			const aboutSectionVideos = [];

			// TODO: p-limit for concurrency
			for (const video of aboutSection.videos) {
				const src = createGitHubUrl(video.src);

				aboutSectionVideos.push({ ...video, src });
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
				const src = createGitHubUrl(video.src);

				testimonialSectionVideos.push({ ...video, src });
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
			const { default: component, tableOfContents } = await evaluate(content, evaluateOptions);
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
				lastModified: null,
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
			const { default: component, tableOfContents } = await evaluate(content, evaluateOptions);

			return {
				id,
				content: component,
				href,
				metadata,
				tableOfContents,
				lastModified: null,
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

			const { default: component } = await evaluate(content, evaluateOptions);
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
			const { default: component, tableOfContents } = await evaluate(content, evaluateOptions);

			const sessions = [];

			// TODO: p-limit for concurrency
			for (const session of metadata.sessions) {
				const { default: component } = await evaluate(session.content, evaluateOptions);

				const presentations = [];

				// TODO: p-limit for concurrency
				for (const presentation of session.presentations) {
					const { default: component } = await evaluate(presentation.content, evaluateOptions);

					presentations.push({ ...presentation, content: component });
				}

				sessions.push({ ...session, content: component, presentations });
			}

			const organisations = [];

			// TODO: p-limit for concurrency
			for (const organisation of metadata.organisations) {
				const logo = createGitHubUrl(organisation.logo);

				organisations.push({ ...organisation, logo });
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
					organisations,
					sessions,
				},
				curricula,
				related,
				tableOfContents,
				lastModified: null,
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
			const { default: component, tableOfContents } = await evaluate(content, evaluateOptions);
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
				lastModified: null,
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
			const { default: component, tableOfContents } = await evaluate(content, evaluateOptions);
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
				lastModified: null,
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
			const { default: component, tableOfContents } = await evaluate(content, evaluateOptions);
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
				lastModified: null,
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
			const { default: component } = await evaluate(content, evaluateOptions);
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

			const { default: component } = await evaluate(content, evaluateOptions);

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
