import * as fs from 'fs'
import * as path from 'path'

import { getCoursePreviews } from '@/cms/api/courses.api'
import { getEventPreviews } from '@/cms/api/events.api'
import { getPostPreviews } from '@/cms/api/posts.api'
import { log } from '@/utils/log'

/**
 * Dumps resource metadata to public folder as json.
 */
async function main() {
  const locale = 'en'

  const outputFolder = path.join(process.cwd(), 'public', 'metadata')
  fs.mkdirSync(outputFolder, { recursive: true })

  const resources = (await getPostPreviews(locale)).map((resource) => {
    if (typeof resource.featuredImage === 'object') {
      delete resource.featuredImage.blurDataURL
    }
    return {
      ...resource,
      authors: resource.authors.map((author) => {
        if (typeof author.avatar === 'object') {
          delete author.avatar.blurDataURL
        }
        return author
      }),
      editors:
        resource.editors?.map((editor) => {
          if (typeof editor.avatar === 'object') {
            delete editor.avatar.blurDataURL
          }
          return editor
        }) ?? [],
      contributors:
        resource.contributors?.map((contributor) => {
          if (typeof contributor.avatar === 'object') {
            delete contributor.avatar.blurDataURL
          }
          return contributor
        }) ?? [],
    }
  })
  fs.writeFileSync(
    path.join(outputFolder, 'resources.json'),
    JSON.stringify({ resources }),
    {
      encoding: 'utf-8',
    },
  )

  const curricula = (await getCoursePreviews(locale)).map((course) => {
    if (typeof course.featuredImage === 'object') {
      delete course.featuredImage.blurDataURL
    }
    return {
      ...course,
      editors:
        course.editors?.map((editor) => {
          if (typeof editor.avatar === 'object') {
            delete editor.avatar.blurDataURL
          }
          return editor
        }) ?? [],
    }
  })
  fs.writeFileSync(
    path.join(outputFolder, 'curricula.json'),
    JSON.stringify({ curricula }),
    {
      encoding: 'utf-8',
    },
  )

  const events = (await getEventPreviews(locale)).map((event) => {
    if (typeof event.featuredImage === 'object') {
      delete event.featuredImage.blurDataURL
    }
    if (typeof event.logo === 'object') {
      delete event.logo.blurDataURL
    }
    return {
      ...event,
      authors: event.authors.map((author) => {
        if (typeof author.avatar === 'object') {
          delete author.avatar.blurDataURL
        }
        return author
      }),
      partners: event.partners.map((partner) => {
        if (typeof partner.logo === 'object') {
          delete partner.logo.blurDataURL
        }
        return partner
      }),
    }
  })
  fs.writeFileSync(
    path.join(outputFolder, 'events.json'),
    JSON.stringify({ events }),
    {
      encoding: 'utf-8',
    },
  )
}

main()
  .then(() => {
    log.success('Successfully dumped resource metadata to public folder.')
  })
  .catch(log.error)
