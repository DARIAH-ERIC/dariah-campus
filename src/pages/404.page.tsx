import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { PageContent } from '@/common/PageContent'
import { PageTitle } from '@/common/PageTitle'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'

export interface NotFoundPageProps {
  dictionary: Dictionary
}

/**
 * Provides translations.
 */
export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<NotFoundPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  return {
    props: {
      dictionary,
    },
  }
}

/**
 * Not found page.
 */
export default function NotFoundPage(_props: NotFoundPageProps): JSX.Element {
  const { t } = useI18n()

  return (
    <Fragment>
      <Metadata noindex nofollow title={t('common.page.notFound')} />
      <PageContent className="grid place-items-center">
        <div className="space-y-2 text-center">
          <PageTitle>{t('common.pageNotFound')}</PageTitle>
          <p>{t('common.pageNotFoundMessage')}</p>
        </div>
      </PageContent>
    </Fragment>
  )
}
