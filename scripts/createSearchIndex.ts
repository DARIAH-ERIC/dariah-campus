import { promises as fs } from 'fs'

import { loadEnvConfig } from '@next/env'
import algoliasearch from 'algoliasearch'
import type { SearchIndex } from 'algoliasearch'
import remark from 'remark'
import withFootnotes from 'remark-footnotes'
import withFrontmatter from 'remark-frontmatter'
import withGfm from 'remark-gfm'
import toPlaintext from 'strip-markdown'
import type { Processor } from 'unified'

import { getCourseFilePath, getCoursePreviews } from '@/cms/api/courses.api'
import { getEventFilePath, getEventPreviews } from '@/cms/api/events.api'
import { getPostFilePath, getPostPreviews } from '@/cms/api/posts.api'
import type { Locale } from '@/i18n/i18n.config'
import type {
  IndexedCourse,
  IndexedEvent,
  IndexedResource,
  IndexedType,
} from '@/search/types'
import { log } from '@/utils/log'
import { noop } from '@/utils/noop'

loadEnvConfig(process.cwd(), false, { info: noop, error: log.error })

/**
 * Returns algolia search client configured with admin permissions.
 */
function getAlgoliaSearchIndex(): SearchIndex | null {
  if (
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID == null ||
    process.env.ALGOLIA_ADMIN_API_KEY == null ||
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME == null
  ) {
    const error = new Error(
      'Failed to update search index because no Algolia config was provided.',
    )
    delete error.stack
    throw error
  }

  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY,
  )

  const searchIndex = searchClient.initIndex(
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  )

  return searchIndex
}

/**
 * Creates `unified` processor to convert mdx to plaintext. Keeps image alt text.
 */
async function createProcessor() {
  // TODO:
  // const { remarkMdx } = await import('xdm/lib/plugin/remark-mdx')
  const processor = remark()
    .use(withFrontmatter)
    .use(withGfm)
    .use(withFootnotes)
    // .use(remarkMdx)
    .use(toPlaintext)
  return processor
}

function createObjectId(...args: [IndexedType, ...Array<string>]) {
  return args.join('-')
}

async function getResourceObjects(
  locale: Locale,
  processor: Processor,
): Promise<Array<IndexedResource>> {
  const resources = await getPostPreviews(locale)
  const type = 'resources' as const

  return Promise.all(
    resources
      .map((resource) => {
        return {
          type,
          kind: resource.kind,
          id: resource.id,
          objectID: createObjectId(type, resource.kind, resource.id),
          title: resource.title,
          date: resource.date,
          lang: resource.lang,
          authors: resource.authors.map((author) => {
            return {
              id: author.id,
              lastName: author.lastName,
              firstName: author.firstName,
            }
          }),
          tags: resource.tags.map((tag) => {
            return {
              name: tag.name,
              id: tag.id,
            }
          }),
          abstract: resource.abstract,
        }
      })
      .map(async (resource) => {
        const filePath = getPostFilePath(resource.id, locale)
        const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' })
        const plaintext = String(await processor.process(fileContent))
        return {
          ...resource,
          body: plaintext,
        }
      }),
  )
}

async function getCourseObjects(
  locale: Locale,
  processor: Processor,
): Promise<Array<IndexedCourse>> {
  const courses = await getCoursePreviews(locale)
  const type = 'courses' as const

  return Promise.all(
    courses
      .map((course) => {
        return {
          type,
          id: course.id,
          objectID: createObjectId(type, course.id),
          title: course.title,
          date: course.date,
          lang: course.lang,
          tags: course.tags.map((tag) => {
            return {
              name: tag.name,
              id: tag.id,
            }
          }),
          abstract: course.abstract,
        }
      })
      .map(async (course) => {
        const filePath = getCourseFilePath(course.id, locale)
        const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' })
        const plaintext = String(await processor.process(fileContent))
        return {
          ...course,
          body: plaintext,
        }
      }),
  )
}

async function getEventObjects(
  locale: Locale,
  processor: Processor,
): Promise<Array<IndexedEvent>> {
  const events = await getEventPreviews(locale)
  const type = 'events' as const

  return Promise.all(
    events
      .map((event) => {
        return {
          type,
          id: event.id,
          kind: event.kind,
          objectID: createObjectId(type, event.id),
          title: event.title,
          date: event.date,
          lang: event.lang,
          tags: event.tags.map((tag) => {
            return {
              name: tag.name,
              id: tag.id,
            }
          }),
          abstract: event.abstract,
        }
      })
      .map(async (event) => {
        const filePath = getEventFilePath(event.id, locale)
        const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' })
        const plaintext = String(await processor.process(fileContent))
        return {
          ...event,
          body: plaintext,
        }
      }),
  )
}

/**
 * Updates Algolia search index.
 */
async function generate() {
  const searchIndex = getAlgoliaSearchIndex()
  if (searchIndex == null) return

  const processor = await createProcessor()

  const locale = 'en'
  const resources = await getResourceObjects(locale, processor)
  const courses = await getCourseObjects(locale, processor)
  const events = await getEventObjects(locale, processor)

  return searchIndex.saveObjects([...resources, ...courses, ...events])
}

generate()
  .then(() => {
    log.success('Successfully updated Algolia search index.')
  })
  .catch(log.error)
