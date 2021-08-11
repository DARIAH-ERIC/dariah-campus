import * as fs from 'fs'
import * as path from 'path'

import { log } from '@/utils/log'

/**
 * Netlify's Next.js plugin currently does not support defining headers, redirects and rewrites
 * via `next.config.js`, but requires using netlify's own custom format.
 *
 * @see https://github.com/netlify/netlify-plugin-nextjs/issues/150
 */
async function main() {
  const rewrites = [
    '# rewrites',
    '/resources /resources/page/1 200',
    '/resources/:type /resources/:type/page/1 200',
    '/courses /courses/page/1 200',
    '/authors /authors/page/1 200',
    '/author/:id /author/:id/page/1 200',
    '/tags /tags/page/1 200',
    '/tag/:id /tag/:id/page/1 200',
    '/categories /categories/page/1 200',
    '/category/:id /category/:id/page/1 200',
    '/about /docs/about 200',
  ]

  const temporaryRedirectConfigs: Record<
    string,
    (uuid: string, slug: string) => string
  > = {
    'redirects.resources.json': (uuid, slug) =>
      `/id/${uuid} /resource/posts/${slug} 302`,
    'redirects.events.json': (uuid, slug) =>
      `/id/${uuid} /resource/events/${slug} 302`,
    'redirects.courses.json': (uuid, slug) =>
      `/id/${uuid} /curriculum/${slug} 302`,
  }

  const temporaryRedirects = ['# temporary redirects']

  Object.entries(temporaryRedirectConfigs).forEach(
    ([fileName, createRedirect]) => {
      const filePath = path.join(process.cwd(), fileName)
      const fileContents: Record<string, string> = JSON.parse(
        fs.readFileSync(filePath, { encoding: 'utf-8' }),
      )
      Object.entries(fileContents).forEach(([uuid, slug]) => {
        temporaryRedirects.push(createRedirect(uuid, slug))
      })
    },
  )

  const permanentRedirectConfigs: Record<
    string,
    (oldSlug: string, slug: string) => string
  > = {
    'redirects.legacy.resources.json': (oldSlug, slug) =>
      `/resource/${oldSlug} /resource/posts/${slug} 301`,
    'redirects.legacy.events.json': (oldSlug, slug) =>
      `/resource/${oldSlug} /resource/events/${slug} 301`,
    'redirects.legacy.persons.json': (oldSlug, slug) =>
      `/author/${oldSlug}  /author/${slug} 301`,
  }

  const permanentRedirects = ['# permanent redirects']

  Object.entries(permanentRedirectConfigs).forEach(
    ([fileName, createRedirect]) => {
      const filePath = path.join(process.cwd(), fileName)
      const fileContents: Record<string, string> = JSON.parse(
        fs.readFileSync(filePath, { encoding: 'utf-8' }),
      )
      Object.entries(fileContents).forEach(([oldSlug, slug]) => {
        permanentRedirects.push(createRedirect(oldSlug, slug))
      })
    },
  )

  const output = [
    rewrites.join('\n'),
    temporaryRedirects.join('\n'),
    permanentRedirects.join('\n'),
  ].join('\n\n')

  fs.writeFileSync(path.join(process.cwd(), '_redirects'), output, {
    encoding: 'utf-8',
  })
}

main()
  .then(() =>
    log.success('Successfully updated Netlify rewrites and redirects.'),
  )
  .catch(log.error)
