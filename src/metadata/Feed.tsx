import Head from 'next/head'

import { createUrl } from '@/utils/createUrl'
import { url as siteUrl, feedFileName } from '~/config/site.config'

/**
 * Provides RSS feed.
 */
export function Feed(): JSX.Element {
  const url = String(createUrl({ pathname: feedFileName, baseUrl: siteUrl }))

  return (
    <Head>
      <link rel="alternate" type="application/rss+xml" title="RSS" href={url} />
    </Head>
  )
}
