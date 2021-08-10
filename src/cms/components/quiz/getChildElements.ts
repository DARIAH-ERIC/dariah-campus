import type { ReactNode } from 'react'
import { Children, isValidElement } from 'react'

/**
 * Returns component children which are valid React elements.
 */
export function getChildElements(children: ReactNode): Array<JSX.Element> {
  return Children.toArray(children).filter(isValidElement)
}
