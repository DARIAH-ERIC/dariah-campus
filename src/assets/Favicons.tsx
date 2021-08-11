import Head from 'next/head'

import { useLocale } from '@/i18n/useLocale'

/**
 * Provides favicons for the current locale.
 *
 * Favicons are generated at build-time with `scripts/createFavicons.ts`.
 */
export function Favicons(): JSX.Element {
  const { locale, defaultLocale } = useLocale()
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const prefix = locale === defaultLocale ? '' : `/${locale}`

  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${prefix}/apple-touch-icon.png`}
        key="apple-touch-icon"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${prefix}/favicon-32x32.png`}
        key="favicon-32x32"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${prefix}/favicon-16x16.png`}
        key="favicon-16x16"
      />
    </Head>
  )
}
