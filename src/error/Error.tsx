export interface ErrorProps {
  message?: string
  statusCode?: number
}

/**
 * Displays error message and status code.
 */
export function Error({
  message = 'An unexpected error has occurred.',
  statusCode = 500,
}: ErrorProps): JSX.Element {
  return (
    <p>
      {message} ({statusCode})
    </p>
  )
}
