import { loadEnvConfig } from '@next/env'
import type { SearchIndex } from 'algoliasearch'
import algoliasearch from 'algoliasearch'

import { getCoursePreviews } from '@/cms/api/courses.api'
import { getEventPreviews } from '@/cms/api/events.api'
import { getPostPreviews } from '@/cms/api/posts.api'
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

function createObjectId(...args: [IndexedType, ...Array<string>]) {
  return args.join('-')
}

async function getResourceObjects(
  locale: Locale,
): Promise<Array<IndexedResource>> {
  const _resources = await getPostPreviews(locale)
  const resources = _resources.filter((resource) => {
    return resource.draft !== true
  })
  const type = 'resources' as const

  return Promise.all(
    resources.map((resource) => {
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
    }),
  )
}

async function getCourseObjects(locale: Locale): Promise<Array<IndexedCourse>> {
  const courses = await getCoursePreviews(locale)
  const type = 'courses' as const

  return Promise.all(
    courses.map((course) => {
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
    }),
  )
}

async function getEventObjects(locale: Locale): Promise<Array<IndexedEvent>> {
  const events = await getEventPreviews(locale)
  const type = 'events' as const

  return Promise.all(
    events.map((event) => {
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
    }),
  )
}

/**
 * Updates Algolia search index.
 */
async function generate() {
  const searchIndex = getAlgoliaSearchIndex()
  if (searchIndex == null) return

  const locale = 'en'
  const resources = await getResourceObjects(locale)
  const courses = await getCourseObjects(locale)
  const events = await getEventObjects(locale)

  return searchIndex.saveObjects([...resources, ...courses, ...events])
}

generate()
  .then(() => {
    log.success('Successfully updated Algolia search index.')
  })
  .catch(log.error)
