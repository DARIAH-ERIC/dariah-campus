import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment, useState } from 'react'

import { PageContent } from '@/common/PageContent'
import { Spinner } from '@/common/Spinner'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'

export interface CourseRegistryPageProps {
  dictionary: Dictionary
}

/**
 * Provides data and translations for course registry page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<CourseRegistryPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  return {
    props: {
      dictionary,
    },
  }
}

/**
 * Course registry page.
 */
export default function CourseRegistryPage(
  _props: CourseRegistryPageProps,
): JSX.Element {
  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  const [isLoadingIframe, setIsLoadingIframe] = useState(true)

  function onLoadIframe() {
    setIsLoadingIframe(false)
  }

  return (
    <Fragment>
      <Metadata
        title={t('common.page.courseRegistry')}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="grid">
        <h1 className="sr-only">DH Course Registry</h1>
        <div className="relative flex flex-col h-full min-h-[calc(100vh-var(--page-header-height))]">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-600">
            <Spinner className={isLoadingIframe ? undefined : 'hidden'} />
          </div>
          <iframe
            src="https://dhcr.clarin-dariah.eu?parent_domain=dariah.eu"
            title="DH Course Registry"
            loading="lazy"
            className="relative w-full h-full"
            onLoad={onLoadIframe}
          />
        </div>
      </PageContent>
    </Fragment>
  )
}
