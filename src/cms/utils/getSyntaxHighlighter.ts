import type { Highlighter } from 'shiki'
import { getHighlighter } from 'shiki'

/**
 * Returns syntax highlighter which works in a `node` environment.
 */
export function getSyntaxHighlighter(): Promise<Highlighter> {
  return getHighlighter({ theme: 'poimandres' })
}
