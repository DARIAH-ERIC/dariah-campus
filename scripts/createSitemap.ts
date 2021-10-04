import generate from '@stefanprobst/next-sitemap'

import { log } from '@/utils/log'
import { url as siteUrl } from '~/config/site.config'

/**
 * Generates `sitemap.xml` and `robots.txt`.
 */
generate({
  baseUrl: siteUrl,
  shouldFormat: true,
  robots: true,
  filter(route) {
    return (
      route !== '/' &&
      !route.endsWith('/404') &&
      !route.endsWith('/500') &&
      !route.endsWith('/admin') &&
      !route.endsWith('/imprint')
    )
  },
})
  .then(() => {
    log.success('Successfully generated sitemap.')
  })
  .catch(log.error)
