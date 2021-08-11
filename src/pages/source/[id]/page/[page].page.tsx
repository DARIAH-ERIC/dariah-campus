import type { ParsedUrlQuery } from 'querystring'

import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { Fragment } from 'react'

import { getCategoryById, getCategoryIds } from '@/cms/api/categories.api'
import type { Category as CategoryData } from '@/cms/api/categories.api'
import type { EventPreview } from '@/cms/api/events.api'
import { getEventPreviews } from '@/cms/api/events.api'
import type { PostPreview } from '@/cms/api/posts.api'
import { getPostPreviewsByCategoryId } from '@/cms/queries/posts.queries'
import { getPageRange, paginate } from '@/cms/utils/paginate'
import type { Page } from '@/cms/utils/paginate'
import { PageContent } from '@/common/PageContent'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { routes } from '@/navigation/routes.config'
import { Pagination } from '@/views/post/Pagination'
import { ResourcesList } from '@/views/post/ResourcesList'

const pageSize = 12

export interface CategoryPageParams extends ParsedUrlQuery {
  id: string
  page: string
}

export interface CategoryPageProps {
  dictionary: Dictionary
  category: CategoryData
  posts: Page<PostPreview | EventPreview>
}

/**
 * Creates page for every category.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<CategoryPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getCategoryIds(locale)
        return (
          await Promise.all(
            ids.map(async (id) => {
              // FIXME:
              const resources =
                id === 'events'
                  ? await getEventPreviews(locale)
                  : await getPostPreviewsByCategoryId(id, locale)
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
 * Provides category metadata, metadata for posts in that category and
 * translations for category page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<CategoryPageParams>,
): Promise<GetStaticPropsResult<CategoryPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const { id } = context.params as CategoryPageParams
  const category = await getCategoryById(id, locale)

  const page = Number(context.params?.page)
  const resources =
    id === 'events'
      ? await getEventPreviews(locale)
      : await getPostPreviewsByCategoryId(id, locale)
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const paginated = paginate<PostPreview | EventPreview>(resources, pageSize)[
    page - 1
  ]!

  return {
    props: {
      dictionary,
      category,
      posts: paginated,
    },
  }
}

/**
 * Category page.
 */
export default function CategoryPage(props: CategoryPageProps): JSX.Element {
  const { category, posts } = props

  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={category.name}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="w-full max-w-screen-xl px-4 py-8 mx-auto space-y-10 xs:py-16 xs:px-8">
        <h1 className="text-4.5xl font-bold text-center">{category.name}</h1>
        <p className="text-lg text-center text-neutral-500">
          {category.description}
        </p>
        <section className="space-y-5">
          <h2 className="sr-only">Posts</h2>
          <ResourcesList resources={posts.items} />
          <Pagination
            page={posts.page}
            pages={posts.pages}
            href={(page) => {
              return routes.category({ id: category.id, resourcePage: page })
            }}
          />
        </section>
      </PageContent>
    </Fragment>
  )
}
