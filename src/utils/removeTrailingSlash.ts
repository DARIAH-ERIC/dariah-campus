/**
 * Removes trailing slash from path.
 */
export function removeTrailingSlash(path: string): string {
  if (path.endsWith('/') && path !== '/') {
    return path.slice(0, -1)
  }
  return path
}
