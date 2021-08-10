import * as fs from 'fs'
import * as path from 'path'

import { format } from 'prettier'

import { getCoursePreviews } from '@/cms/api/courses.api'
import { getEventPreviews } from '@/cms/api/events.api'
import { getPostPreviews } from '@/cms/api/posts.api'
import { log } from '@/utils/log'

function createRedirects(
  resources: Array<{ uuid: string; id: string }>,
  fileName: string,
) {
  const redirects: Record<string, string> = {}

  resources.forEach((resource) => {
    redirects[resource.uuid] = resource.id
  })

  fs.writeFileSync(
    path.join(process.cwd(), fileName),
    format(JSON.stringify(redirects), { parser: 'json' }),
    {
      encoding: 'utf-8',
    },
  )
}

/**
 * Creates redirects.
 */
async function main() {
  const locale = 'en'

  const resources = await getPostPreviews(locale)
  createRedirects(resources, 'redirects.resources.json')

  const events = await getEventPreviews(locale)
  createRedirects(events, 'redirects.events.json')

  const courses = await getCoursePreviews(locale)
  createRedirects(courses, 'redirects.courses.json')
}

main()
  .then(() => log.success('Successfully updated resource redirects.'))
  .catch(log.error)
