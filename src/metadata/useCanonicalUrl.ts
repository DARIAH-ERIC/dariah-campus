import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { useLocale } from '@/i18n/useLocale'
import { createUrl } from '@/utils/createUrl'
import { url as baseUrl } from '~/config/site.config'

/**
 * Returns the canonical URL for the current route's pathname.
 *
 * @param query Optionally include specified query params. By default, only the
 * pathname is used for the canonical URL, and all query params are removed.
 */
export function useCanonicalUrl(query?: NextRouter['query']): string {
  const router = useRouter()
  const { locale } = useLocale()

  const canonicalUrl = useMemo(() => {
    const { pathname } = createUrl({ pathname: router.asPath })
    const url = createUrl({
      baseUrl,
      locale,
      pathname,
      query,
    })

    return String(url)
  }, [router, locale, query])

  return canonicalUrl
}
