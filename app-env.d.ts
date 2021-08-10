/* eslint-disable import/no-duplicates, import/order */

/// <reference types="@stefanprobst/next-svg" />

declare module '*.mdx' {
  import type { ComponentType } from 'react'

  const Component: ComponentType
  const metadata: Record<string, unknown>

  export { metadata }
  export default Component
}

declare module 'retext' {
  import type { Processor } from 'unified'

  const retext: Processor
  export = retext
}
declare module 'retext-smartypants' {
  import type { Plugin } from 'unified'

  const smartypants: Plugin
  export = smartypants
}
