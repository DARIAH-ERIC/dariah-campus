/**
 * HTTP error.
 */
export class HttpError extends Error {
  name = 'HttpError'
  statusCode: number

  constructor(response: Response) {
    super(response.statusText)

    this.statusCode = response.status
  }
}
