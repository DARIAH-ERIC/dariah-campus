import * as path from 'path'

import generate from '@stefanprobst/favicons'
import sharp from 'sharp'

import { defaultLocale } from '@/i18n/i18n.config'
import { log } from '@/utils/log'
import { webManifest } from '~/config/site.config'
import { siteMetadata } from '~/config/siteMetadata.config'

/**
 * Generates favicons and webmanifest for all locales.
 */
Promise.all(
  Object.entries(siteMetadata).map(
    ([locale, { favicon, shortTitle, title, image }]) => {
      const outputFolder =
        locale === defaultLocale ? 'public' : ['public', locale].join('/')

      return generate({
        inputFilePath: favicon.src,
        outputFolder,
        name: title,
        shortName: shortTitle,
        maskable: favicon.maskable,
        color: '#fff',
        manifestFileName: webManifest,
      }).then(() => {
        return sharp(image.src)
          .resize({
            width: 1200,
            height: 628,
            fit: 'contain',
            background: 'transparent',
          })
          .webp()
          .toFile(path.join(outputFolder, 'open-graph.webp'))
      })
    },
  ),
)
  .then(() => {
    log.success('Successfully generated favicons.')
  })
  .catch(log.error)
