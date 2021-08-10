export class MissingContextProviderError extends Error {
  name = 'MissingContextProviderError'

  constructor(hook: string, provider: string) {
    super(`\`${hook}\` must be nested inside a \`${provider}\`.`)
  }
}
