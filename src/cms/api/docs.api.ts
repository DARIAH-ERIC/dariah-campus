import { join } from 'path'

import withExtractedTableOfContents from '@stefanprobst/rehype-extract-toc'
import type { Toc } from '@stefanprobst/rehype-extract-toc'
import withSyntaxHighlighting from '@stefanprobst/rehype-shiki'
import withHeadingIds from 'rehype-slug'
import withFootnotes from 'remark-footnotes'
import withGitHubMarkdown from 'remark-gfm'
import type { VFile } from 'vfile'
import vfile from 'vfile'

import { getSyntaxHighlighter } from '@/cms/utils/getSyntaxHighlighter'
import type { Locale } from '@/i18n/i18n.config'
import { extractFrontmatter } from '@/mdx/extractFrontmatter'
import withDownloadsLinks from '@/mdx/plugins/rehype-download-links'
import withHeadingLinks from '@/mdx/plugins/rehype-heading-links'
import withImageCaptions from '@/mdx/plugins/rehype-image-captions'
import withLazyLoadingImages from '@/mdx/plugins/rehype-lazy-loading-images'
import withNoReferrerLinks from '@/mdx/plugins/rehype-no-referrer-links'
import withTypographicQuotesAndDashes from '@/mdx/plugins/remark-smartypants'
import { readFile } from '@/mdx/readFile'
import { readFolder } from '@/mdx/readFolder'
import type { FilePath } from '@/utils/ts/aliases'

const docsFolder = join(process.cwd(), 'content', 'docs')
const docExtension = '.mdx'

export interface DocId {
  /** Slug. */
  id: string
}

type ID = DocId['id']

export interface DocFrontmatter {
  title: string
  order: number
}

export type DocMetadata = DocFrontmatter

export interface DocData {
  /** Metadata. */
  metadata: DocMetadata
  /** Table of contents. */
  toc: Toc
}

export interface Doc extends DocId {
  /** Metadata and table of contents. */
  data: DocData
  /** Mdx compiled to function body. Must be hydrated on the client with `useMdx`. */
  code: string
}

export interface DocPreview extends DocId, DocMetadata {}

/**
 * Returns all doc ids (slugs).
 */
export async function getDocIds(_locale: Locale): Promise<Array<string>> {
  const ids = await readFolder(docsFolder)

  return ids
}

/**
 * Returns doc content, table of contents, and metadata.
 */
export async function getDocById(id: ID, locale: Locale): Promise<Doc> {
  const [file, metadata] = await readFileAndGetDocMetadata(id, locale)
  const code = String(await compileMdx(file))
  const vfileData = file.data as { toc: Toc }

  const data = {
    metadata,
    toc: vfileData.toc,
  }

  return {
    id,
    data,
    code,
  }
}

/**
 * Returns all docs, sorted by date.
 */
export async function getDocs(locale: Locale): Promise<Array<Doc>> {
  const ids = await getDocIds(locale)

  const docs = await Promise.all(
    ids.map(async (id) => {
      return getDocById(id, locale)
    }),
  )

  docs.sort((a, b) => {
    return a.data.metadata.order === b.data.metadata.order
      ? 0
      : a.data.metadata.order > b.data.metadata.order
      ? 1
      : -1
  })

  return docs
}

/**
 * Returns metadata for doc.
 */
export async function getDocPreviewById(
  id: ID,
  locale: Locale,
): Promise<DocPreview> {
  const [, metadata] = await readFileAndGetDocMetadata(id, locale)

  return { id, ...metadata }
}

/**
 * Returns metadata for all docs, sorted by date.
 */
export async function getDocPreviews(
  locale: Locale,
): Promise<Array<DocPreview>> {
  const ids = await getDocIds(locale)

  const metadata = await Promise.all(
    ids.map(async (id) => {
      return getDocPreviewById(id, locale)
    }),
  )

  metadata.sort((a, b) => {
    return a.order === b.order ? 0 : a.order > b.order ? 1 : -1
  })

  return metadata
}

/**
 * Reads doc file.
 */
async function getDocFile(id: ID, locale: Locale): Promise<VFile> {
  const filePath = getDocFilePath(id, locale)
  const file = await readFile(filePath)

  return file
}

/**
 * Returns file path for doc.
 */
export function getDocFilePath(id: ID, _locale: Locale): FilePath {
  const filePath = join(docsFolder, id, 'index' + docExtension)

  return filePath
}

/**
 * Extracts doc metadata and resolves foreign-key relations.
 */
async function getDocMetadata(
  file: VFile,
  locale: Locale,
): Promise<DocMetadata> {
  const matter = await getDocFrontmatter(file, locale)

  const metadata: DocMetadata = matter

  return metadata
}

/**
 * Extracts doc frontmatter.
 */
async function getDocFrontmatter(
  file: VFile,
  _locale: Locale,
): Promise<DocFrontmatter> {
  extractFrontmatter(file)

  const { matter } = file.data as { matter: DocFrontmatter }

  return matter
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
  /**
   * Using a dynamic import for `xdm`, which is an ESM-only package,
   * so `getDocPreviews` can be called in scripts with `ts-node`.
   */
  const { compile } = await import('xdm')

  const highlighter = await getSyntaxHighlighter()

  /**
   * FIXME: We clone the input 'vfile' because we cannot mutate the cached 'vfile',
   * which will be reused as input in development with "fast refresh".
   * See below: we shouldn't cache the vfile in the first place, only the metadata.
   */
  return compile(vfile({ ...file }), {
    outputFormat: 'function-body',
    useDynamicImport: false,
    remarkPlugins: [
      withGitHubMarkdown,
      withFootnotes,
      withTypographicQuotesAndDashes,
    ],
    rehypePlugins: [
      [withSyntaxHighlighting, { highlighter }],
      withHeadingIds,
      withExtractedTableOfContents,
      withHeadingLinks,
      withNoReferrerLinks,
      withLazyLoadingImages,
      withImageCaptions,
      withDownloadsLinks,
    ],
  })
}

/**
 * Cache for doc metadata.
 */
const docCache: Record<Locale, Map<string, Promise<[VFile, DocMetadata]>>> = {
  en: new Map(),
}

/**
 * Caches doc metadata and vfile.
 *
 * VFile must be cached as well because doc body is stripped of frontmatter.
 *
 * FIXME: we should just use `remark-mdx-frontmatter` for getDocbyId, and for the doc
 * previews just cache metadata, not the stripped vfile as well. so we don't have to
 * keep it in memory.
 */
async function readFileAndGetDocMetadata(id: ID, locale: Locale) {
  const cache = docCache[locale]

  if (!cache.has(id)) {
    cache.set(
      id,
      getDocFile(id, locale).then(async (file) => {
        const metadata = await getDocMetadata(file, locale)
        return [file, metadata]
      }),
    )
  }

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  return cache.get(id)!
}
