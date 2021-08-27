import { useEffect, useState } from 'react'

// TODO: move to config to avoid including rehype-heading-links in client bundle
import { headingAnchorClassName as mdxHeadingAnchorClassName } from '@/mdx/plugins/rehype-heading-links'

/**
 * Highlights table of contents entry corresponding to current scroll position.
 */
export function useTableOfContentsHighlight(
  headingAnchorClassName = mdxHeadingAnchorClassName,
): string | undefined {
  const [firstHeadingInViewport, setFirstHeadingInViewport] = useState<
    string | undefined
  >()

  const topOffset = 0

  useEffect(() => {
    function getFirstHeadingInViewport() {
      const headings = Array.from(
        document.getElementsByClassName(headingAnchorClassName),
      )

      const firstHeadingInViewport =
        headings.find((heading) => {
          return heading.getBoundingClientRect().top >= topOffset
        }) ?? headings[headings.length - 1]

      setFirstHeadingInViewport(firstHeadingInViewport?.id)
    }

    getFirstHeadingInViewport()

    document.addEventListener('resize', getFirstHeadingInViewport, {
      passive: true,
    })
    document.addEventListener('scroll', getFirstHeadingInViewport, {
      passive: true,
    })

    return () => {
      document.removeEventListener('resize', getFirstHeadingInViewport)
      document.removeEventListener('scroll', getFirstHeadingInViewport)
    }
  }, [headingAnchorClassName])

  return firstHeadingInViewport
}
