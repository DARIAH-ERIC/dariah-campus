import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

import { isAbsoluteUrl } from '@/utils/isAbsoluteUrl'

/**
 * Uses client-side transition for relative links, and a regular HTML anchor
 * element for absolute urls.
 */
export function RelativeOrAbsoluteLink(
  props: ComponentPropsWithoutRef<'a'>,
): JSX.Element | null {
  if (props.href == null) return null

  if (isAbsoluteUrl(props.href)) {
    return <a {...props}>{props.children}</a>
  }

  return (
    <Link href={props.href}>
      <a {...props} rel={undefined} target={undefined}>
        {props.children}
      </a>
    </Link>
  )
}
