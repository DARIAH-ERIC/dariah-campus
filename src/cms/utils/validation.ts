/**
 * RegEx for email addresses.
 */
export const isEmailLike =
  '^[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*$'

/**
 * RegEx for URLs.
 */
export const isUrl = '^[a-zA-Z][a-zA-Z\\d+\\-.]*:'

/**
 * RegEx for Twitter handles.
 */
export const isTwitterHandle = '^@'
