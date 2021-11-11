import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { ComponentPropsWithoutRef } from 'react'
import { Fragment } from 'react'

import { OptOutButton as UnstyledOptOutButton } from '@/analytics/OptOutButton'
import { PageContent } from '@/common/PageContent'
import { PageTitle } from '@/common/PageTitle'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import Mdx from '~/content/pages/imprint/index.mdx'

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
 * Imprint page.
 */
export default function ImprintPage(): JSX.Element {
  const { t } = useI18n()

  return (
    <Fragment>
      <Metadata title={t('common.page.imprint')} noindex nofollow />
      <PageContent className="grid w-full max-w-screen-lg px-4 py-8 mx-auto space-y-24 xs:py-16 xs:px-8 2xl:grid-cols-content-layout 2xl:space-y-0 2xl:gap-x-10 2xl:max-w-none">
        <aside />
        <div className="min-w-0 space-y-16">
          <PageTitle>{t('common.page.imprint')}</PageTitle>
          <div className="prose-sm prose max-w-none sm:prose sm:max-w-none">
            <Mdx components={{ OptOutButton }} />
          </div>
        </div>
      </PageContent>
    </Fragment>
  )
}

function OptOutButton(props: ComponentPropsWithoutRef<'button'>) {
  return <UnstyledOptOutButton {...props} className="font-medium underline" />
}
