import { noop } from '@/utils/noop'

export interface Logger {
  success: (message: string) => void
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
}

/**
 * Logs messages to the console.
 */
export const log: Logger =
  /* eslint-disable no-console */
  typeof window === 'undefined' || process.env.NODE_ENV !== 'production'
    ? {
        success(message) {
          console.info('✅', message)
        },
        info(message) {
          console.info('ℹ️', message)
        },
        warn(message) {
          console.warn('⚠️', message)
        },
        error(message) {
          console.error('⛔', message)
        },
      }
    : {
        success: noop,
        info: noop,
        warn: noop,
        error: noop,
      }
