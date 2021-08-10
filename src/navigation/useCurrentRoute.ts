import type { UrlObject } from 'url'

import type { LinkProps } from 'next/link'
import { useRouter } from 'next/router'

import { createUrl } from '@/utils/createUrl'
import { removeTrailingSlash } from '@/utils/removeTrailingSlash'

export interface RouteMatcher {
  (href: UrlObject, route: UrlObject, _page: string): boolean
}

/**
 * Returns whether the `href` matches the currently active route.
 */
export function useCurrentRoute(
  href: LinkProps['href'],
  isMatching: RouteMatcher = isMatchingPathnameExactly,
): boolean {
  const router = useRouter()

  const currentUrl = createUrl({ pathname: router.asPath })
  const linkUrl =
    typeof href === 'string' ? createUrl({ pathname: href }) : href

  const isCurrent = isMatching(linkUrl, currentUrl, router.route)

  return isCurrent
}

/**
 * Default matcher function.
 * Matches pathnames exactly, query params are ignored.
 */
function isMatchingPathnameExactly(
  href: UrlObject,
  route: UrlObject,
  _page: string,
): boolean {
  return (
    removeTrailingSlash(route.pathname ?? '') ===
    removeTrailingSlash(href.pathname ?? '')
  )
}
