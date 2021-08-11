import Head from 'next/head'

import { useLocale } from '@/i18n/useLocale'
import { webManifest } from '~/config/site.config'

/**
 * Provides web manifest for the current locale.
 *
 * The web manifests are generated at build-time with `scripts/createFavicons.ts`.
 */
export function WebManifest(): JSX.Element {
  const { locale, defaultLocale } = useLocale()
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const prefix = locale === defaultLocale ? '' : `/${locale}`

  return (
    <Head>
      <link
        rel="manifest"
        href={`${prefix}/${webManifest}`}
        key="webmanifest"
      />
    </Head>
  )
}
