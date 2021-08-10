import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import type { Locale } from '@/i18n/i18n.config'
import { useLocale } from '@/i18n/useLocale'
import { useSiteMetadata } from '@/metadata/useSiteMetadata'
import { createUrl } from '@/utils/createUrl'

/**
 * Returns URLs to be used in `hreflang` attributes.
 *
 * @param query Optionally include specified query params. By default, only the
 * pathname is used for the canonical URL, and all query params are removed.
 */
export function useAlternateUrls(
  query?: NextRouter['query'],
): Array<{ hrefLang: Locale; href: string }> {
  const router = useRouter()
  const { locales } = useLocale()
  const { url: siteUrl } = useSiteMetadata()

  const urls = useMemo(() => {
    return locales.map((locale) => {
      const { pathname } = createUrl({ pathname: router.asPath })
      const url = createUrl({
        baseUrl: siteUrl,
        locale,
        pathname: pathname,
        query,
      })

      return { hrefLang: locale, href: String(url) }
    })
  }, [router, locales, siteUrl, query])

  return urls
}
