import { useError } from '@stefanprobst/next-error-boundary'

import { Error } from '@/error/Error'

/**
 * Error boundary fallback.
 */
export function ClientError(): JSX.Element {
  const { error } = useError()

  return <Error message={error.message} />
}
