import algoliasearch from 'algoliasearch/lite'
import type { SearchIndex } from 'algoliasearch/lite'

import { log } from '@/utils/log'

let hasDisplayedWarning = false

/**
 * Returns configured algolia search client.
 */
export function getAlgoliaSearchIndex(): SearchIndex | null {
  if (
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID == null ||
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY == null ||
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME == null
  ) {
    if (!hasDisplayedWarning) {
      log.warn('Search is disabled because no Algolia config was provided.')
      hasDisplayedWarning = true
    }
    return null
  }

  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
  )

  const searchIndex = searchClient.initIndex(
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  )

  return searchIndex
}
