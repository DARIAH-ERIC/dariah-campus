import { compile } from "@mdx-js/mdx";
import withSyntaxHighlighting from "@stefanprobst/rehype-shiki";
import { type PreviewTemplateComponentProps } from "decap-cms-core";
import { useEffect, useMemo, useState } from "react";
import withHeadingIds from "rehype-slug";
import withGitHubMarkdown from "remark-gfm";
import { type Highlighter } from "shiki";

import { type PostFrontmatter, type PostMetadata } from "@/cms/api/posts.api";
import { getSyntaxHighlighter } from "@/cms/previews/getSyntaxHighlighter";
import { Preview } from "@/cms/previews/Preview";
import { Spinner } from "@/common/Spinner";
import withHeadingLinks from "@/mdx/plugins/rehype-heading-links";
import withImageCaptions from "@/mdx/plugins/rehype-image-captions";
import withNoReferrerLinks from "@/mdx/plugins/rehype-no-referrer-links";
import withCmsPreviewAssets from "@/mdx/plugins/remark-cms-preview-assets";
import withTypographicQuotesAndDashes from "@/mdx/plugins/remark-smartypants";
import withCmsPreviewMdxAttributeAssets from "@/mdx/plugins/withCmsPreviewMdxAttributeAssets";
import { useDebouncedState } from "@/utils/useDebouncedState";
import { Resource } from "@/views/post/Resource";

const initialMetadata: PostMetadata = {
	authors: [],
	tags: [],
	categories: [],
	licence: { id: "", name: "", url: "" },
	type: { id: "", name: "" },
	uuid: "",
	title: "",
	lang: "en",
	date: new Date(0).toISOString(),
	version: "",
	abstract: "",
	domain: "",
	targetGroup: "",
};

/**
 * CMS preview for resource.
 */
export function ResourcePreview(props: PreviewTemplateComponentProps): JSX.Element {
	const entry = useDebouncedState(props.entry, 250);
	const { fieldsMetaData, getAsset } = props;

	const data = entry.get("data");
	const body = entry.getIn(["data", "body"]);

	const [metadata, setMetadata] = useState<PostMetadata>(initialMetadata);
	const [mdxContent, setMdxContent] = useState<Error | string | null>(null);
	const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

	useEffect(() => {
		async function initializeHighlighter() {
			const highlighter = await getSyntaxHighlighter();
			setHighlighter(highlighter);
		}

		initializeHighlighter();
	}, []);

	const compileMdx = useMemo(() => {
		if (highlighter == null) return null;

		return async (code: string) => {
			return String(
				await compile(code, {
					development: false,
					outputFormat: "function-body",
					useDynamicImport: false,
					remarkPlugins: [
						withGitHubMarkdown,
						withTypographicQuotesAndDashes,
						[withCmsPreviewAssets, getAsset],
						[withCmsPreviewMdxAttributeAssets, getAsset],
					],
					rehypePlugins: [
						[withSyntaxHighlighting, { highlighter }],
						withHeadingIds,
						withHeadingLinks,
						withNoReferrerLinks,
						withImageCaptions,
					],
				}),
			);
		};
	}, [getAsset, highlighter]);

	useEffect(() => {
		function resolveRelation(path: Array<string>, id: string) {
			const metadata = fieldsMetaData.getIn([...path, id]);
			if (metadata == null) return null;
			return { id, ...metadata.toJS() };
		}

		const { body: _, ...partialFrontmatter } = data.toJS();
		const frontmatter = partialFrontmatter as Partial<PostFrontmatter>;

		const authors = Array.isArray(frontmatter.authors)
			? frontmatter.authors
					.map((id) => {
						return resolveRelation(["authors", "people"], id);
					})
					.filter(Boolean)
					.map((author) => {
						// FIXME: how to resolve asset path on related item?
						// We cannot use `getAsset` because that is bound to the `posts` collection.
						return {
							...author,
							avatar: undefined,
						};
					})
			: [];

		const contributors = Array.isArray(frontmatter.contributors)
			? frontmatter.contributors
					.map((id) => {
						return resolveRelation(["contributors", "people"], id);
					})
					.filter(Boolean)
			: [];

		const editors = Array.isArray(frontmatter.editors)
			? frontmatter.editors
					.map((id) => {
						return resolveRelation(["editors", "people"], id);
					})
					.filter(Boolean)
			: [];

		const tags = Array.isArray(frontmatter.tags)
			? frontmatter.tags
					.map((id) => {
						return resolveRelation(["tags", "tags"], id);
					})
					.filter(Boolean)
			: [];

		const categories = Array.isArray(frontmatter.categories)
			? frontmatter.categories
					.map((id) => {
						return resolveRelation(["categories", "categories"], id);
					})
					.filter(Boolean)
			: [];

		const licence =
			frontmatter.licence != null
				? resolveRelation(["licence", "licences"], frontmatter.licence)
				: null;

		const type =
			frontmatter.type != null ? resolveRelation(["type", "contentTypes"], frontmatter.type) : null;

		const date =
			frontmatter.date == null || frontmatter.date.length === 0
				? initialMetadata.date
				: frontmatter.date;

		const featuredImage =
			frontmatter.featuredImage != null
				? String(getAsset(frontmatter.featuredImage))
				: frontmatter.featuredImage;

		const metadata = {
			...initialMetadata,
			...frontmatter,
			authors,
			contributors,
			date,
			editors,
			tags,
			categories,
			type,
			licence,
			featuredImage,
		};

		setMetadata(metadata);
	}, [data, fieldsMetaData, getAsset]);

	useEffect(() => {
		let wasCanceled = false;

		async function processMdx() {
			try {
				if (compileMdx == null) return Promise.resolve();
				const code = await compileMdx(body);

				if (!wasCanceled) {
					setMdxContent(code);
				}
			} catch (error) {
				console.error(error);
				setMdxContent(new Error("Failed to render mdx."));
			}
		}

		processMdx();

		return () => {
			wasCanceled = true;
		};
	}, [body, compileMdx]);

	return (
		<Preview {...props}>
			{typeof mdxContent === "string" ? (
				<Resource
					resource={{
						id: entry.get("slug"),
						kind: "posts",
						code: mdxContent,
						data: {
							metadata,
							toc: [],
							/** We don't include `remark-reading-time` in the mdx compiler for previews. */
							timeToRead: 1,
						},
					}}
					lastUpdatedAt={null}
					isPreview
				/>
			) : mdxContent instanceof Error ? (
				<div>
					<p>Failed to render preview.</p>
					<p>This usually indicates a syntax error in the Markdown content.</p>
				</div>
			) : (
				<div className="flex items-center space-x-2">
					<Spinner className="w-6 h-6 text-primary-600" aria-label="Loading..." />
					<p>Trying to render preview...</p>
				</div>
			)}
		</Preview>
	);
}
