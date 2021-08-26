/**
 * Returns whether a URL is absolute.
 */
export function isAbsoluteUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
