import type { ParsedUrlQuery } from 'querystring'

import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { Fragment } from 'react'

import { getTagById, getTagIds } from '@/cms/api/tags.api'
import type { Tag as TagData } from '@/cms/api/tags.api'
import { getEventPreviewsByTagId } from '@/cms/queries/events.queries'
import { getPostPreviewsByTagId } from '@/cms/queries/posts.queries'
import type { Page } from '@/cms/utils/paginate'
import { getPageRange, paginate } from '@/cms/utils/paginate'
import { LeadIn } from '@/common/LeadIn'
import { PageContent } from '@/common/PageContent'
import { PageTitle } from '@/common/PageTitle'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { routes } from '@/navigation/routes.config'
import type { ResourceListItem } from '@/views/post/getResourceListData'
import { getResourceListData } from '@/views/post/getResourceListData'
import { Pagination } from '@/views/post/Pagination'
import { ResourcesList } from '@/views/post/ResourcesList'

const pageSize = 12

export interface TagPageParams extends ParsedUrlQuery {
  id: string
  page: string
}

export interface TagPageProps {
  dictionary: Dictionary
  tag: TagData
  resources: Page<ResourceListItem>
}

/**
 * Creates page for every tag.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<TagPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getTagIds(locale)
        return (
          await Promise.all(
            ids.map(async (id) => {
              const posts = await getPostPreviewsByTagId(id, locale)
              const events = await getEventPreviewsByTagId(id, locale)
              const resources = [...posts, ...events]

              const pages = getPageRange(resources, pageSize)
              return pages.map((page) => {
                return {
                  params: { id, page: String(page) },
                  locale,
                }
              })
            }),
          )
        ).flat()
      }),
    )
  ).flat()

  return {
    paths,
    fallback: false,
  }
}

/**
 * Provides tag metadata, metadata for posts tagged with that tag and
 * translations for tag page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<TagPageParams>,
): Promise<GetStaticPropsResult<TagPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const { id } = context.params as TagPageParams
  const tag = await getTagById(id, locale)

  const page = Number(context.params?.page)
  const posts = await getPostPreviewsByTagId(id, locale)
  const events = await getEventPreviewsByTagId(id, locale)
  const sortedResources: Array<ResourceListItem> = getResourceListData([
    ...posts,
    ...events,
  ]).sort((a, b) => {
    return a.date > b.date ? -1 : 1
  })

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const resources = paginate(sortedResources, pageSize)[page - 1]!

  return {
    props: {
      dictionary,
      tag,
      resources,
    },
  }
}

/**
 * Tag page.
 */
export default function TagPage(props: TagPageProps): JSX.Element {
  const { tag, resources: posts } = props

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={tag.name}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="w-full max-w-screen-xl px-4 py-8 mx-auto space-y-10 xs:py-16 xs:px-8 outline-none">
        <PageTitle>{tag.name}</PageTitle>
        <LeadIn>{tag.description}</LeadIn>
        <section className="space-y-5">
          <h2 className="sr-only">{t('common.resources')}</h2>
          <ResourcesList resources={posts.items} />
          <Pagination
            page={posts.page}
            pages={posts.pages}
            href={(page) => {
              return routes.tag({ id: tag.id, resourcePage: page })
            }}
          />
        </section>
      </PageContent>
    </Fragment>
  )
}
