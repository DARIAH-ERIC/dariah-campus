import cx from 'clsx'
import type { ReactNode } from 'react'

import { mainContentId } from '@/common/SkipLink'

export interface PageContentProps {
  children: ReactNode
  className?: string
}

/**
 * Wrapper for main page content.
 */
export function PageContent(props: PageContentProps): JSX.Element {
  const { children, className } = props

  return (
    <main
      id={mainContentId}
      tabIndex={-1}
      className={cx(
        className,
        'flex-1 mt-[var(--page-header-height)]',
        'focus-visible:ring-inset focus-visible:ring focus-visible:ring-primary-600',
      )}
    >
      {children}
    </main>
  )
}
