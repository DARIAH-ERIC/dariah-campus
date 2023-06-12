import { join } from "node:path";

import { compile } from "@mdx-js/mdx";
import withSyntaxHighlighting from "@stefanprobst/rehype-shiki";
import sizeOf from "image-size";
import withGitHubMarkdown from "remark-gfm";
import { VFile } from "vfile";

import { type Category, type CategoryId } from "@/cms/api/categories.api";
import { getCategoryById } from "@/cms/api/categories.api";
import { type ContentType, type ContentTypeId } from "@/cms/api/contentTypes.api";
import { getContentTypeById } from "@/cms/api/contentTypes.api";
import { type Licence, type LicenceId } from "@/cms/api/licences.api";
import { getLicenceById } from "@/cms/api/licences.api";
import { type Organisation, type OrganisationId } from "@/cms/api/organisations.api";
import { getOrganisationById } from "@/cms/api/organisations.api";
import { type Person, type PersonId } from "@/cms/api/people.api";
import { getPersonById } from "@/cms/api/people.api";
import { type Tag, type TagId } from "@/cms/api/tags.api";
import { getTagById } from "@/cms/api/tags.api";
import { getSyntaxHighlighter } from "@/cms/utils/getSyntaxHighlighter";
import { type Locale } from "@/i18n/i18n.config";
import { extractFrontmatter } from "@/mdx/extractFrontmatter";
import withDownloadsLinks from "@/mdx/plugins/rehype-download-links";
import withImageCaptions from "@/mdx/plugins/rehype-image-captions";
import withFigureImages from "@/mdx/plugins/rehype-lazy-loading-figure-images";
import withLazyLoadingImages from "@/mdx/plugins/rehype-lazy-loading-images";
import withNoReferrerLinks from "@/mdx/plugins/rehype-no-referrer-links";
import withTypographicQuotesAndDashes from "@/mdx/plugins/remark-smartypants";
import { readFile } from "@/mdx/readFile";
import { readFolder } from "@/mdx/readFolder";
import { copyAsset } from "@/mdx/utils/copyAsset";
import { type FilePath, type IsoDateString, type UrlString } from "@/utils/ts/aliases";

const eventsFolder = join(process.cwd(), "content", "events");
const eventExtension = ".mdx";

export interface EventId {
	/** Slug. */
	id: string;
	/** Resource type. */
	kind: "events";
}

type ID = EventId["id"];

export interface EventFrontmatter {
	uuid: string;
	title: string;
	shortTitle?: string;
	eventType?: string;
	lang: "en";
	date: IsoDateString;
	authors: Array<PersonId["id"]>;
	tags: Array<TagId["id"]>;
	logo?: FilePath;
	featuredImage?: FilePath;
	abstract: string;
	licence: LicenceId["id"];
	categories: Array<CategoryId["id"]>;
	type: ContentTypeId["id"];

	about: string;
	prep?: string;

	partners?: Array<OrganisationId["id"]>;
	social?: {
		website?: UrlString;
		email?: string;
		twitter?: string;
		flickr?: UrlString;
	};
	synthesis?: FilePath;
	sessions: Array<EventSessionFrontmatter>;
}

export interface EventSessionFrontmatter {
	title: string;
	speakers: Array<PersonId["id"]>;
	body: string;
	synthesis?: FilePath;
}

export interface EventPreviewMetadata
	extends Omit<
		EventFrontmatter,
		"authors" | "categories" | "featuredImage" | "licence" | "logo" | "partners" | "tags" | "type"
	> {
	authors: Array<Person>;
	tags: Array<Tag>;
	categories: Array<Category>;
	type: ContentType;
	licence: Licence;
	partners: Array<Organisation>;
	featuredImage?: FilePath | { src: FilePath; width: number; height: number };
	logo?: FilePath | { src: FilePath; width: number; height: number };
}

export interface EventMetadata extends Omit<EventPreviewMetadata, "about" | "prep" | "sessions"> {
	sessions: Array<EventSessionMetadata>;
	about: { code: string } | null;
	prep: { code: string } | null;
}

export interface EventSessionMetadata {
	title: string;
	speakers: Array<Person>;
	body: { code: string };
	synthesis?: FilePath;
}

export interface EventData {
	/** Metadata. */
	metadata: EventMetadata;
}

export interface Event extends EventId {
	/** Metadata and table of contents. */
	data: EventData;
	/** Mdx compiled to function body. Must be hydrated on the client with `useMdx`. */
	code: string;
}

export interface EventPreview extends EventId, EventPreviewMetadata {}

/**
 * Returns all event ids (slugs).
 */
export async function getEventIds(_locale: Locale): Promise<Array<string>> {
	const ids = await readFolder(eventsFolder);

	return ids;
}

/**
 * Returns event content, table of contents, and metadata.
 */
export async function getEventById(id: ID, locale: Locale): Promise<Event> {
	const [file, previewMetadata] = await readFileAndGetEventMetadata(id, locale);
	const code = String(await compileMdx(file));

	if (previewMetadata.synthesis != null) {
		const paths = copyAsset(previewMetadata.synthesis, file.path, "asset");
		if (paths != null) {
			previewMetadata.synthesis = paths.publicPath;
		}
	}

	const metadata = {
		...previewMetadata,
		sessions: await Promise.all(
			previewMetadata.sessions.map(async (session) => {
				const speakers = await Promise.all(
					session.speakers.map((id) => {
						return getPersonById(id, locale);
					}),
				);

				const code = String(await compileMdx(new VFile({ value: session.body, path: file.path })));

				const sessionData = {
					...session,
					speakers,
					body: { code },
				};

				if (session.synthesis != null) {
					const paths = copyAsset(session.synthesis, file.path, "asset");
					if (paths != null) {
						sessionData.synthesis = paths.publicPath;
					}
				}

				return sessionData;
			}),
		),

		about: {
			code: String(await compileMdx(new VFile({ value: previewMetadata.about, path: file.path }))),
		},
		prep:
			previewMetadata.prep != null
				? {
						code: String(
							await compileMdx(new VFile({ value: previewMetadata.prep, path: file.path })),
						),
				  }
				: null,
	};

	const data = {
		metadata,
	};

	return {
		id,
		kind: "events",
		data,
		code,
	};
}

/**
 * Returns all events, sorted by date.
 */
export async function getEvents(locale: Locale): Promise<Array<Event>> {
	const ids = await getEventIds(locale);

	const events = await Promise.all(
		ids.map(async (id) => {
			return getEventById(id, locale);
		}),
	);

	events.sort((a, b) => {
		return a.data.metadata.date === b.data.metadata.date
			? 0
			: a.data.metadata.date > b.data.metadata.date
			? -1
			: 1;
	});

	return events;
}

/**
 * Returns metadata for event.
 */
export async function getEventPreviewById(id: ID, locale: Locale): Promise<EventPreview> {
	const [, metadata] = await readFileAndGetEventMetadata(id, locale);

	return { id, kind: "events", ...metadata };
}

/**
 * Returns metadata for all events, sorted by date.
 */
export async function getEventPreviews(locale: Locale): Promise<Array<EventPreview>> {
	const ids = await getEventIds(locale);

	const metadata = await Promise.all(
		ids.map(async (id) => {
			return getEventPreviewById(id, locale);
		}),
	);

	metadata.sort((a, b) => {
		return a.date === b.date ? 0 : a.date > b.date ? -1 : 1;
	});

	return metadata;
}

/**
 * Reads event file.
 */
async function getEventFile(id: ID, locale: Locale): Promise<VFile> {
	const filePath = getEventFilePath(id, locale);
	const file = await readFile(filePath);

	return file;
}

/**
 * Returns file path for event.
 */
export function getEventFilePath(id: ID, _locale: Locale): FilePath {
	const filePath = join(eventsFolder, id, "index" + eventExtension);

	return filePath;
}

/**
 * Extracts event metadata and resolves foreign-key relations.
 */
async function getEventMetadata(file: VFile, locale: Locale): Promise<EventPreviewMetadata> {
	const matter = await getEventFrontmatter(file, locale);

	const metadata: EventPreviewMetadata = {
		...matter,
		authors: Array.isArray(matter.authors)
			? await Promise.all(
					matter.authors.map((id) => {
						return getPersonById(id, locale);
					}),
			  )
			: [],
		tags: Array.isArray(matter.tags)
			? await Promise.all(
					matter.tags.map((id) => {
						return getTagById(id, locale);
					}),
			  )
			: [],
		categories: Array.isArray(matter.categories)
			? await Promise.all(
					matter.categories.map((id) => {
						return getCategoryById(id, locale);
					}),
			  )
			: [],
		type: await getContentTypeById(matter.type, locale),
		licence: await getLicenceById(matter.licence, locale),
		partners: Array.isArray(matter.partners)
			? await Promise.all(
					matter.partners.map((id) => {
						return getOrganisationById(id, locale);
					}),
			  )
			: [],
	};

	if (matter.featuredImage != null) {
		const result = copyAsset(matter.featuredImage, file.path);
		if (result != null) {
			const dimensions = sizeOf(result.srcFilePath);
			if (dimensions.width != null && dimensions.height != null) {
				metadata.featuredImage = {
					src: result.publicPath,
					width: dimensions.width,
					height: dimensions.height,
				};
			}
		}
	}

	if (matter.logo != null) {
		const result = copyAsset(matter.logo, file.path);
		if (result != null) {
			const dimensions = sizeOf(result.srcFilePath);
			if (dimensions.width != null && dimensions.height != null) {
				metadata.logo = {
					src: result.publicPath,
					width: dimensions.width,
					height: dimensions.height,
				};
			}
		}
	}

	return metadata;
}

/**
 * Extracts event frontmatter.
 */
async function getEventFrontmatter(file: VFile, _locale: Locale): Promise<EventFrontmatter> {
	extractFrontmatter(file);

	const { matter } = file.data as { matter: EventFrontmatter };

	return matter;
}

/**
 * Compiles markdown and mdx content to function body.
 * Must be hydrated on the client with `useMdx`.
 *
 * Treats `.md` files as markdown, and `.mdx` files as mdx.
 *
 * Supports CommonMark, GitHub Markdown, and Pandoc Footnotes.
 */
async function compileMdx(file: VFile): Promise<VFile> {
	const highlighter = await getSyntaxHighlighter();

	/**
	 * FIXME: We clone the input 'vfile' because we cannot mutate the cached 'vfile',
	 * which will be reused as input in development with "fast refresh".
	 * See below: we shouldn't cache the vfile in the first place, only the metadata.
	 */
	return compile(new VFile({ ...file }), {
		development: false,
		outputFormat: "function-body",
		useDynamicImport: false,
		remarkPlugins: [withGitHubMarkdown, withTypographicQuotesAndDashes],
		rehypePlugins: [
			[withSyntaxHighlighting, { highlighter }],
			withNoReferrerLinks,
			withLazyLoadingImages,
			withFigureImages,
			withImageCaptions,
			withDownloadsLinks,
		],
	});
}

/**
 * Cache for event metadata.
 */
const eventCache: Record<Locale, Map<string, Promise<[VFile, EventPreviewMetadata]>>> = {
	en: new Map(),
};

/**
 * Caches event metadata and vfile.
 *
 * VFile must be cached as well because event body is stripped of frontmatter.
 *
 * FIXME: we should just use `remark-mdx-frontmatter` for getEventbyId, and for the event
 * previews just cache metadata, not the stripped vfile as well. so we don't have to
 * keep it in memory.
 */
async function readFileAndGetEventMetadata(id: ID, locale: Locale) {
	const cache = eventCache[locale];

	if (!cache.has(id)) {
		cache.set(
			id,
			getEventFile(id, locale).then(async (file) => {
				const metadata = await getEventMetadata(file, locale);
				return [file, metadata];
			}),
		);
	}

	/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
	return cache.get(id)!;
}
