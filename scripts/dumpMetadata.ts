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

  const resources = await getPostPreviews(locale)
  fs.writeFileSync(
    path.join(outputFolder, 'resources.json'),
    JSON.stringify({ resources }),
    {
      encoding: 'utf-8',
    },
  )

  const curricula = await getCoursePreviews(locale)
  fs.writeFileSync(
    path.join(outputFolder, 'curricula.json'),
    JSON.stringify({ curricula }),
    {
      encoding: 'utf-8',
    },
  )

  const events = await getEventPreviews(locale)
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
