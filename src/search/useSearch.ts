import type { Hit } from '@algolia/client-search'
import { useEffect, useState } from 'react'

import { getAlgoliaSearchIndex } from '@/search/getAlgoliaSearchIndex'
import type { IndexedCourse, IndexedResource } from '@/search/types'

const searchStatus = [
  'idle',
  'loading',
  'success',
  'error',
  'disabled',
] as const

export type SearchStatus = typeof searchStatus[number]

/**
 * Returns search results for search term.
 */
export function useSearch(searchTerm: string): {
  data: Array<Hit<IndexedResource | IndexedCourse>> | undefined
  status: SearchStatus
  error: Error | null
} {
  const [searchIndex] = useState(() => getAlgoliaSearchIndex())
  const [searchResults, setSearchResults] = useState<
    Array<Hit<IndexedResource | IndexedCourse>>
  >([])
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let wasCanceled = false

    async function search() {
      if (searchIndex == null) {
        setStatus('disabled')
        return
      }

      if (searchTerm.length === 0) return

      setStatus('loading')

      try {
        const results = await searchIndex.search<
          IndexedResource | IndexedCourse
        >(searchTerm, {
          hitsPerPage: 10,
          attributesToRetrieve: ['type', 'kind', 'id', 'title', 'tags'],
          attributesToHighlight: ['title'],
          attributesToSnippet: ['abstract', 'body'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
          snippetEllipsisText: '&hellip;',
        })

        if (!wasCanceled) {
          setSearchResults(results.hits)
          setStatus('success')
        }
      } catch (error) {
        if (!wasCanceled) {
          setError(error)
          setStatus('error')
        }
      }
    }

    search()

    return () => {
      wasCanceled = true
    }
  }, [searchTerm, searchIndex])

  return {
    data: searchResults,
    status,
    error,
  }
}
