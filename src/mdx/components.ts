import type { ComponentType } from 'react'

import { Download } from '@/cms/components/Download'
import { Grid } from '@/cms/components/Grid'
import { SideNote } from '@/cms/components/SideNote'
import { Video } from '@/cms/components/Video'

export type MdxComponentType =
  /** Layout wrapper. */
  | 'wrapper'
  /** CommonMark. */
  | 'a'
  | 'blockquote'
  | 'code'
  | 'em'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'hr'
  | 'img'
  | 'li'
  | 'ol'
  | 'p'
  | 'pre'
  | 'strong'
  | 'ul'
  /** GitHub markdown. */
  | 'del'
  | 'table'
  | 'tbody'
  | 'td'
  | 'th'
  | 'thead'
  | 'tr'

export type MdxComponentMap = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [name: string]: JSX.IntrinsicElements | ComponentType<any>
}

/**
 * Legacy component names.
 */
const legacyComponents: MdxComponentMap = {
  Flex: Grid,
  Panel: SideNote,
  Youtube: Video,
  YouTube: Video,
}

/**
 * Custom components allowed in mdx content.
 */
export const components: MdxComponentMap = {
  ...legacyComponents,
  Download,
  Grid,
  SideNote,
  Video,
}
