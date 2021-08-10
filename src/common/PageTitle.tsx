import type { ReactNode } from 'react'

export interface PageTitleProps {
  children: ReactNode
}

/**
 * Page title.
 */
export function PageTitle(props: PageTitleProps): JSX.Element {
  const { children } = props

  return (
    <h1 className="mb-4 text-4xl font-extrabold leading-10 text-center">
      {children}
    </h1>
  )
}
