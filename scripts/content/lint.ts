// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { glob } from "node:fs/promises";
import { join, relative } from "node:path";
import { parseArgs } from "node:util";

import { assert, includes, isNonEmptyString, log } from "@acdh-oeaw/lib";
import { deadOrAlive } from "dead-or-alive";
import getNetworkStatus from "is-online";
import type { Node, Root } from "mdast";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx-jsx";
import { remark } from "remark";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import withMdx from "remark-mdx";
import { read } from "to-vfile";
import { lintRule } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import * as v from "valibot";
import type { VFile } from "vfile";
import { reporter } from "vfile-reporter";
import * as YAML from "yaml";

import { socialMediaKinds, videoProviders } from "@/lib/content/options";
import { createVideoUrl } from "@/lib/navigation/create-video-url";

const skipUrlPatterns = [/^(?!https?:\/\/)/i];

interface Options {}

/** @see https://github.com/remarkjs/remark-lint-no-dead-urls */
async function rule(tree: Root, file: VFile, _options: Options) {
	const nodesByInvalidUrl = new Map<string, Array<Node>>();
	const nodesByUrl = new Map<string, Array<Node>>();

	function add(value: string, node: Node) {
		if (
			skipUrlPatterns.some((pattern) => {
				return pattern.test(value);
			})
		) {
			return;
		}

		if (!URL.canParse(value)) {
			if (nodesByInvalidUrl.has(value)) {
				nodesByInvalidUrl.get(value)!.push(node);
			} else {
				nodesByInvalidUrl.set(value, [node]);
			}
			return;
		}

		const url = new URL(value).href;

		if (nodesByUrl.has(url)) {
			nodesByUrl.get(url)!.push(node);
		} else {
			nodesByUrl.set(url, [node]);
		}
	}

	visit(tree, (node) => {
		// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
		switch (node.type) {
			case "yaml": {
				try {
					const frontmatter = YAML.parse(node.value) as Record<string, unknown>;

					const directory = relative(file.cwd, file.dirname!);

					const socialMediaIds: Array<string> = socialMediaKinds
						.map((kind) => {
							return kind.value;
						})
						.filter((value) => {
							return value !== "email";
						});

					if (directory.includes("events")) {
						const result = v.parse(
							v.object({
								links: v.array(v.object({ href: v.string() })),
								organisations: v.array(v.object({ url: v.string() })),
								sessions: v.array(
									v.object({
										links: v.array(v.object({ href: v.string() })),
										presentations: v.array(
											v.object({
												links: v.array(v.object({ href: v.string() })),
											}),
										),
									}),
								),
								social: v.array(v.object({ discriminant: v.string(), value: v.string() })),
							}),
							frontmatter,
						);

						for (const link of result.links) {
							add(link.href, node);
						}

						for (const organisation of result.organisations) {
							add(organisation.url, node);
						}

						for (const session of result.sessions) {
							for (const link of session.links) {
								add(link.href, node);
							}

							for (const presentation of session.presentations) {
								for (const link of presentation.links) {
									add(link.href, node);
								}
							}
						}

						for (const social of result.social) {
							if (socialMediaIds.includes(social.discriminant)) {
								add(social.value, node);
							}
						}
					}

					if (directory.includes("external")) {
						const result = v.parse(
							v.object({
								remote: v.object({ url: v.string() }),
							}),
							frontmatter,
						);

						add(result.remote.url, node);
					}

					if (directory.includes("people")) {
						const result = v.parse(
							v.object({
								social: v.array(v.object({ discriminant: v.string(), value: v.string() })),
							}),
							frontmatter,
						);

						for (const social of result.social) {
							if (socialMediaIds.includes(social.discriminant)) {
								add(social.value, node);
							}
						}
					}
				} catch (error) {
					log.error(`Failed to parse frontmatter in \`${file.path}\`.\n`, error);
				}

				break;
			}

			case "link": {
				add(node.url, node);

				break;
			}

			case "mdxJsxFlowElement": {
				function getAttributeValue(node: MdxJsxFlowElement, name: string) {
					const value = node.attributes.find((attribute) => {
						return attribute.type === "mdxJsxAttribute" && attribute.name === name;
					})?.value;

					assert(
						isNonEmptyString(value),
						`Missing or invalid value for attribute \`${name}\` on \`${node.name!}\` component in \`${file.path}\`.`,
					);

					return value;
				}

				// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
				switch (node.name) {
					case "Embed": {
						add(getAttributeValue(node, "src"), node);

						break;
					}

					case "ExternalResource": {
						add(getAttributeValue(node, "url"), node);

						break;
					}

					case "Video":
					case "VideoCard": {
						const id = getAttributeValue(node, "id");
						const provider = getAttributeValue(node, "provider");
						assert(
							includes(
								videoProviders.map((provider) => {
									return provider.value;
								}),
								provider,
							),
							`Invalid \`provider\` attribute on \`${node.name}\` component in \`${file.path}\`.`,
						);
						const url = String(createVideoUrl(provider, id));
						add(url, node);

						break;
					}
				}

				break;
			}

			case "mdxJsxTextElement": {
				function getAttributeExpressionValue(node: MdxJsxTextElement, name: string) {
					const value = node.attributes.find((attribute) => {
						return attribute.type === "mdxJsxAttribute" && attribute.name === name;
					})?.value;

					assert(
						value != null && typeof value === "object",
						`Missing or invalid value for attribute \`${name}\` on \`${node.name!}\` component in \`${file.path}\`.`,
					);

					return value;
				}

				// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
				switch (node.name) {
					case "Link":
					case "LinkButton": {
						const link = getAttributeExpressionValue(node, "link");
						const value = JSON.parse(link.value) as unknown;
						const result = v.safeParse(
							v.object({ discriminant: v.literal("external"), value: v.string() }),
							value,
						);

						if (result.success) {
							add(result.output.value, node);
						}

						break;
					}
				}
				break;
			}

			default: {
				break;
			}
		}
	});

	for (const [url, nodes] of nodesByInvalidUrl) {
		for (const node of nodes) {
			const issue = file.message(`Invalid URL \`${url}\``, {
				ancestors: [node],
				place: node.position,
			});
			issue.fatal = false;
		}
	}

	for (const [url, nodes] of nodesByUrl) {
		const result = await deadOrAlive(url, { findUrls: false });

		for (const node of nodes) {
			for (const message of result.messages) {
				/** Avoid printing full fetch error stacks. */
				if (message.cause instanceof Error) {
					message.cause.stack = "";
				}

				const issue = file.message(`Unexpected dead URL \`${url}\`, expected live URL`, {
					ancestors: [node],
					cause: message,
					place: node.position,
				});
				issue.fatal = message.fatal;
			}

			if (
				result.permanent === true &&
				result.status === "alive" &&
				new URL(url).href !== result.url
			) {
				const message = file.message(
					`Unexpected redirecting URL \`${url}\`, expected final URL \`${result.url}\``,
					{
						ancestors: [node],
						place: node.position,
					},
				);
				message.actual = url;
				message.expected = [result.url];
			}
		}
	}
}

const remarkLintNoDeadUrls = lintRule({ origin: "remark-lint:no-dead-urls" }, rule);

const processor = remark().use(withFrontmatter).use(withGfm).use(withMdx).use(remarkLintNoDeadUrls);

async function check(paths: Array<string>) {
	const results = [];

	for await (const entry of glob(paths, { withFileTypes: true })) {
		const input = await read(join(entry.parentPath, entry.name));
		const result = await processor.process(input);

		results.push(result);
	}

	const report = reporter(results, { quiet: true });
	if (report) {
		log.error("Found issues.\n", report);
	}
}

async function lint() {
	const { values } = parseArgs({
		options: { pattern: { type: "string", multiple: true, short: "p" } },
		allowPositionals: false,
	});

	if (values.pattern == null || values.pattern.length === 0) {
		log.error(
			"Please provide file paths as glob patterns via `--pattern` or `-p` arguments.\n",
			'Example: "content/en/documentation/**/*.mdx".',
		);
		return;
	}

	const isOnline = await getNetworkStatus();

	if (!isOnline) {
		log.warn("No internet connection, skipping linting.");
		return;
	}

	const paths = values.pattern;

	await check(paths);
}

lint().catch((error: unknown) => {
	log.error("Failed to lint.\n", error);
	process.exitCode = 1;
});
