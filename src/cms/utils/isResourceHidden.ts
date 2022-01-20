const isMainBranch = process.env['NEXT_PUBLIC_GIT_BRANCH'] === 'main'

export function isResourceHidden(draft: boolean | undefined): boolean {
  if (draft === true && isMainBranch) return true

  return false
}
