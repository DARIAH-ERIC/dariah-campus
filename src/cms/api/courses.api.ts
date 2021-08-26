import { join } from 'path'

import withSyntaxHighlighting from '@stefanprobst/rehype-shiki'
import sizeOf from 'image-size'
import withHeadingIds from 'rehype-slug'
import withFootnotes from 'remark-footnotes'
import withGitHubMarkdown from 'remark-gfm'
import type { VFile } from 'vfile'
import vfile from 'vfile'

import { getPersonById } from '@/cms/api/people.api'
import type { Person, PersonId } from '@/cms/api/people.api'
import type { PostId, PostPreview } from '@/cms/api/posts.api'
import { getPostPreviewById } from '@/cms/api/posts.api'
import { getTagById } from '@/cms/api/tags.api'
import type { Tag, TagId } from '@/cms/api/tags.api'
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
import { copyAsset } from '@/mdx/utils/copyAsset'
import type { FilePath, IsoDateString } from '@/utils/ts/aliases'

const coursesFolder = join(process.cwd(), 'content', 'courses')
const courseExtension = '.mdx'

export interface CourseId {
  /** Slug. */
  id: string
}

type ID = CourseId['id']

export interface CourseFrontmatter {
  uuid: string
  title: string
  shortTitle?: string
  lang: 'en'
  date: IsoDateString
  version: string
  editors?: Array<PersonId['id']>
  tags: Array<TagId['id']>
  resources: Array<PostId['id']>
  featuredImage?: FilePath
  abstract: string
}

export interface CourseMetadata
  extends Omit<
    CourseFrontmatter,
    'editors' | 'tags' | 'resources' | 'featuredImage'
  > {
  editors?: Array<Person>
  tags: Array<Tag>
  resources: Array<PostPreview>
  featuredImage?: FilePath | StaticImageData
}

export interface CourseData {
  /** Metadata. */
  metadata: CourseMetadata
}

export interface Course extends CourseId {
  /** Metadata and table of contents. */
  data: CourseData
  /** Mdx compiled to function body. Must be hydrated on the client with `useMdx`. */
  code: string
}

export interface CoursePreview extends CourseId, CourseMetadata {}

/**
 * Returns all course ids (slugs).
 */
export async function getCourseIds(_locale: Locale): Promise<Array<string>> {
  const ids = await readFolder(coursesFolder)

  return ids
}

/**
 * Returns course content, table of contents, and metadata.
 */
export async function getCourseById(id: ID, locale: Locale): Promise<Course> {
  const [file, metadata] = await readFileAndGetCourseMetadata(id, locale)
  const code = String(await compileMdx(file))

  const data = { metadata }

  return {
    id,
    data,
    code,
  }
}

/**
 * Returns all courses, sorted by date.
 */
export async function getCourses(locale: Locale): Promise<Array<Course>> {
  const ids = await getCourseIds(locale)

  const courses = await Promise.all(
    ids.map(async (id) => {
      return getCourseById(id, locale)
    }),
  )

  courses.sort((a, b) => {
    return a.data.metadata.date === b.data.metadata.date
      ? 0
      : a.data.metadata.date > b.data.metadata.date
      ? -1
      : 1
  })

  return courses
}

/**
 * Returns metadata for course.
 */
export async function getCoursePreviewById(
  id: ID,
  locale: Locale,
): Promise<CoursePreview> {
  const [, metadata] = await readFileAndGetCourseMetadata(id, locale)

  return { id, ...metadata }
}

/**
 * Returns metadata for all courses, sorted by date.
 */
export async function getCoursePreviews(
  locale: Locale,
): Promise<Array<CoursePreview>> {
  const ids = await getCourseIds(locale)

  const metadata = await Promise.all(
    ids.map(async (id) => {
      return getCoursePreviewById(id, locale)
    }),
  )

  metadata.sort((a, b) => {
    return a.date === b.date ? 0 : a.date > b.date ? -1 : 1
  })

  return metadata
}

/**
 * Reads course file.
 */
async function getCourseFile(id: ID, locale: Locale): Promise<VFile> {
  const filePath = getCourseFilePath(id, locale)
  const file = await readFile(filePath)

  return file
}

/**
 * Returns file path for course.
 */
export function getCourseFilePath(id: ID, _locale: Locale): FilePath {
  const filePath = join(coursesFolder, id, 'index' + courseExtension)

  return filePath
}

/**
 * Extracts course metadata and resolves foreign-key relations.
 */
async function getCourseMetadata(
  file: VFile,
  locale: Locale,
): Promise<CourseMetadata> {
  const matter = await getCourseFrontmatter(file, locale)

  const metadata: CourseMetadata = {
    ...matter,
    editors: Array.isArray(matter.editors)
      ? await Promise.all(
          matter.editors.map((id) => {
            return getPersonById(id, locale)
          }),
        )
      : [],
    tags: Array.isArray(matter.tags)
      ? await Promise.all(
          matter.tags.map((id) => {
            return getTagById(id, locale)
          }),
        )
      : [],
    resources: Array.isArray(matter.resources)
      ? await Promise.all(
          matter.resources.map((id) => {
            return getPostPreviewById(id.replace(/\/index$/, ''), locale)
          }),
        )
      : [],
  }

  if (matter.featuredImage != null) {
    const result = copyAsset(matter.featuredImage, file.path)
    if (result != null) {
      const dimensions = sizeOf(result.srcFilePath)
      if (dimensions.width != null && dimensions.height != null) {
        metadata.featuredImage = {
          src: result.publicPath,
          width: dimensions.width,
          height: dimensions.height,
        }
      }
    }
  }

  return metadata
}

/**
 * Extracts course frontmatter.
 */
async function getCourseFrontmatter(
  file: VFile,
  _locale: Locale,
): Promise<CourseFrontmatter> {
  extractFrontmatter(file)

  const { matter } = file.data as { matter: CourseFrontmatter }

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
   * so `getCoursePreviews` can be called in scripts with `ts-node`.
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
      withHeadingLinks,
      withNoReferrerLinks,
      withLazyLoadingImages,
      withImageCaptions,
      withDownloadsLinks,
    ],
  })
}

/**
 * Cache for course metadata.
 */
const courseCache: Record<
  Locale,
  Map<string, Promise<[VFile, CourseMetadata]>>
> = {
  en: new Map(),
}

/**
 * Caches course metadata and vfile.
 *
 * VFile must be cached as well because course body is stripped of frontmatter.
 *
 * TODO: we should just use `remark-mdx-frontmatter` for getCoursebyId, and for the course
 * previews just cache metadata, not the stripped vfile as well. so we don't have to
 * keep it in memory.
 */
async function readFileAndGetCourseMetadata(id: ID, locale: Locale) {
  const cache = courseCache[locale]

  if (!cache.has(id)) {
    cache.set(
      id,
      getCourseFile(id, locale).then(async (file) => {
        const metadata = await getCourseMetadata(file, locale)
        return [file, metadata]
      }),
    )
  }

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  return cache.get(id)!
}
