import type { ReactNode } from 'react'

export interface LeadInProps {
  children: ReactNode
}

/**
 * Lead in text.
 */
export function LeadIn(props: LeadInProps): JSX.Element {
  const { children } = props

  return <div className="text-lg text-center text-neutral-500">{children}</div>
}
