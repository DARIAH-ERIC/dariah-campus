import rosetta from 'rosetta'
import type { Rosetta } from 'rosetta'

import type { Locale } from '@/i18n/i18n.config'

export interface I18n<T> extends Rosetta<T> {
  formatDate(
    date: Date | number,
    lang?: Locale,
    options?: Intl.DateTimeFormatOptions,
  ): string
  formatRelativeTime(
    time: number,
    unit: Intl.RelativeTimeFormatUnit,
    lang?: Locale,
    options?: Intl.RelativeTimeFormatOptions,
  ): string
  formatNumber(
    number: number,
    lang?: Locale,
    options?: Intl.NumberFormatOptions,
  ): string
  pluralize(
    key: string,
    count: number,
    lang?: Locale,
    options?: Intl.PluralRulesOptions,
  ): string
  sort(lang?: Locale, options?: Intl.CollatorOptions): Intl.Collator['compare']
}

/**
 * Creates rosetta instance.
 */
export function createI18n<T>(
  defaultLang?: Locale,
  defaultDictionary?: T,
): I18n<T> {
  const i18n = rosetta<T>()

  if (defaultLang !== undefined) {
    i18n.locale(defaultLang)

    if (defaultDictionary !== undefined) {
      i18n.set(defaultLang, defaultDictionary)
    }
  }

  /**
   * Formats dates according to locale-aware rules.
   */
  function formatDate(
    date: Date | number,
    lang?: Locale,
    options?: Intl.DateTimeFormatOptions,
  ): string {
    const language = lang ?? i18n.locale()
    // @ts-expect-error "Index signature is missing" error for Intl interface.
    const dateFormat = intl.getDateFormatter(language, options)

    return dateFormat.format(date)
  }

  /**
   * Formats relative time according to locale-aware rules.
   */
  function formatRelativeTime(
    time: number,
    unit: Intl.RelativeTimeFormatUnit,
    lang?: Locale,
    options?: Intl.RelativeTimeFormatOptions,
  ): string {
    const language = lang ?? i18n.locale()
    // @ts-expect-error "Index signature is missing" error for Intl interface.
    const dateFormat = intl.getRelativeTimeFormatter(language, options)

    return dateFormat.format(time, unit)
  }

  /**
   * Formats numbers and currencies according to locale-aware rules.
   */
  function formatNumber(
    number: number,
    lang?: Locale,
    options?: Intl.NumberFormatOptions,
  ): string {
    const language = lang ?? i18n.locale()
    // @ts-expect-error "Index signature is missing" error for Intl interface.
    const numberFormat = intl.getNumberFormatter(language, options)

    return numberFormat.format(number)
  }

  /**
   * Retrieves pluralized key according to locale-aware rules.
   * If no matching key can be found returns an empty string.
   */
  function pluralize(
    key: string,
    count: number,
    lang?: Locale,
    options?: Intl.PluralRulesOptions,
  ): string {
    const language = lang ?? i18n.locale()
    // @ts-expect-error "Index signature is missing" error for Intl interface.
    const pluralRules = intl.getPluralRules(language, options)
    const pluralKey = pluralRules.select(count)

    return i18n.t([key, pluralKey].join('.'))
  }

  /**
   * Compares strings accordings to locale-aware rules.
   */
  function sort(
    lang?: Locale,
    options?: Intl.CollatorOptions,
  ): Intl.Collator['compare'] {
    const language = lang ?? i18n.locale()
    // @ts-expect-error "Index signature is missing" error for Intl interface.
    const collator = intl.getCollator(language, options)

    return collator.compare
  }

  return {
    ...i18n,
    formatDate,
    formatRelativeTime,
    formatNumber,
    pluralize,
    sort,
  }
}

/**
 * Cache for `Intl.*` since instantiating them is potentially expensive.
 */
const cache = {
  dateTimeFormat: new Map(),
  relativeTimeFormat: new Map(),
  numberFormat: new Map(),
  pluralRules: new Map(),
  collator: new Map(),
}

const intl = {
  getDateFormatter(locale: string, options?: Record<string, unknown>) {
    const cacheKey = createCacheKey(locale, options)
    const cached = cache.dateTimeFormat
    if (!cached.has(cacheKey)) {
      cached.set(cacheKey, new Intl.DateTimeFormat(locale, options))
    }
    return cached.get(cacheKey)
  },
  getRelativeTimeFormatter(locale: string, options?: Record<string, unknown>) {
    const cacheKey = createCacheKey(locale, options)
    const cached = cache.relativeTimeFormat
    if (!cached.has(cacheKey)) {
      cached.set(cacheKey, new Intl.RelativeTimeFormat(locale, options))
    }
    return cached.get(cacheKey)
  },
  getNumberFormatter(locale: string, options?: Record<string, unknown>) {
    const cacheKey = createCacheKey(locale, options)
    const cached = cache.numberFormat
    if (!cached.has(cacheKey)) {
      cached.set(cacheKey, new Intl.NumberFormat(locale, options))
    }
    return cached.get(cacheKey)
  },
  getPluralRules(locale: string, options?: Record<string, unknown>) {
    const cacheKey = createCacheKey(locale, options)
    const cached = cache.pluralRules
    if (!cached.has(cacheKey)) {
      cached.set(cacheKey, new Intl.PluralRules(locale, options))
    }
    return cached.get(cacheKey)
  },
  getCollator(locale: string, options?: Record<string, unknown>) {
    const cacheKey = createCacheKey(locale, options)
    const cached = cache.collator
    if (!cached.has(cacheKey)) {
      cached.set(cacheKey, new Intl.Collator(locale, options))
    }
    return cached.get(cacheKey)
  },
}

function createCacheKey(locale: string, options?: Record<string, unknown>) {
  return (
    locale +
    (options
      ? Object.entries(options).sort((a, b) => {
          return a[0] < b[0] ? -1 : 1
        })
      : '')
  )
}
