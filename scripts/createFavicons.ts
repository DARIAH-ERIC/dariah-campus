import generate from '@stefanprobst/favicons'

import { defaultLocale } from '@/i18n/i18n.config'
import { log } from '@/utils/log'
import { webManifest } from '~/config/site.config'
import { siteMetadata } from '~/config/siteMetadata.config'

/**
 * Generates favicons and webmanifest for all locales.
 */
Promise.all(
  Object.entries(siteMetadata).map(([locale, { favicon, shortTitle, title }]) =>
    generate({
      inputFilePath: favicon.src,
      outputFolder:
        locale === defaultLocale ? 'public' : ['public', locale].join('/'),
      name: title,
      shortName: shortTitle,
      maskable: favicon.maskable,
      color: '#fff',
      manifestFileName: webManifest,
    }),
  ),
)
  .then(() => log.success('Successfully generated favicons.'))
  .catch(log.error)
