import type { ParsedUrlQuery } from 'querystring'

import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

import { getCategories, getCategoryIds } from '@/cms/api/categories.api'
import { getEventPreviews } from '@/cms/api/events.api'
import { getPostPreviewsByCategoryId } from '@/cms/queries/posts.queries'
import { getPageRange, paginate } from '@/cms/utils/paginate'
import type { Page } from '@/cms/utils/paginate'
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
import type { CategoryListItem } from '@/views/post/getCategoryListData'

const pageSize = 12

export interface CategoriesPageParams extends ParsedUrlQuery {
  page: string
}

export interface CategoriesPageProps {
  dictionary: Dictionary
  categories: Page<CategoryListItem & { posts: number }>
}

/**
 * Creates categories pages.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<CategoriesPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getCategoryIds(locale)
        const pages = getPageRange(ids, pageSize)
        return pages.map((page) => {
          return {
            params: { page: String(page) },
            locale,
          }
        })
      }),
    )
  ).flat()

  return {
    paths,
    fallback: false,
  }
}

/**
 * Provides metadata and translations for categories page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<CategoriesPageParams>,
): Promise<GetStaticPropsResult<CategoriesPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const page = Number(context.params?.page)
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const categories = paginate(await getCategories(locale), pageSize)[page - 1]!
  const categoriesWithPostCount = (
    await Promise.all(
      categories.items.map(async (category) => {
        const resourcecsWithCategory =
          category.id === 'events'
            ? await getEventPreviews(locale)
            : await getPostPreviewsByCategoryId(category.id, locale)
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          image: category.image,
          posts: resourcecsWithCategory.length,
        }
      }),
    )
  ).filter((category) => {
    return category.posts > 0
  }) // FIXME: paginate after filtering - needs caching!

  return {
    props: {
      dictionary,
      categories: { ...categories, items: categoriesWithPostCount },
    },
  }
}

/**
 * Categories page.
 */
export default function CategoriesPage(
  props: CategoriesPageProps,
): JSX.Element {
  const { categories } = props

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={t('common.page.sources')}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="flex flex-col w-full max-w-screen-xl px-4 py-8 mx-auto space-y-10 xs:py-16 xs:px-8">
        <PageTitle>{t('common.categories')}</PageTitle>
        <LeadIn>{t('common.categoryLeadIn')}</LeadIn>
        <section>
          <ul className="grid gap-8 lg:grid-cols-2">
            {categories.items.map((category, index) => {
              const href = routes.category({ id: category.id })

              return (
                <li key={category.id}>
                  <article className="flex flex-col h-full overflow-hidden shadow-md rounded-xl">
                    {category.image !== undefined ? (
                      <Link href={href}>
                        <a
                          tabIndex={-1}
                          className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
                        >
                          {typeof category.image === 'string' ? (
                            <Image
                              src={category.image}
                              alt=""
                              width={16}
                              height={9}
                              layout="responsive"
                              objectFit="cover"
                              sizes="(max-width: 640px) 584px, (max-width: 1024px) 943px, 584px"
                            />
                          ) : (
                            <Image
                              src={category.image}
                              alt=""
                              placeholder="blur"
                              layout="responsive"
                              objectFit="cover"
                              sizes="(max-width: 640px) 584px, (max-width: 1024px) 943px, 584px"
                              priority={index < 2}
                            />
                          )}
                        </a>
                      </Link>
                    ) : null}
                    <div className="flex-1 p-10 space-y-4">
                      <Link href={href}>
                        <a className="block transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                          <h2 className="text-2xl font-bold">
                            {category.name}
                          </h2>
                        </a>
                      </Link>
                      <p className="leading-7">{category.description}</p>
                    </div>
                    <footer className="flex items-center justify-between px-10 py-8 bg-neutral-100">
                      <span>
                        {category.posts} {t('common.resources')}
                      </span>
                      <Link href={href}>
                        <a
                          tabIndex={-1}
                          className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
                        >
                          {t('common.readMore')} &rarr;
                        </a>
                      </Link>
                    </footer>
                  </article>
                </li>
              )
            })}
          </ul>
        </section>
      </PageContent>
    </Fragment>
  )
}
