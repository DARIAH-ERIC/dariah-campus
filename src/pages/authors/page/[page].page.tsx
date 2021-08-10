import type { ParsedUrlQuery } from 'querystring'

import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

import { Svg as AvatarIcon } from '@/assets/icons/user.svg'
import type { Person } from '@/cms/api/people.api'
import { getPersonIds, getPersons } from '@/cms/api/people.api'
import { getPostPreviewsByAuthorId } from '@/cms/queries/posts.queries'
import { getFullName } from '@/cms/utils/getFullName'
import type { Page } from '@/cms/utils/paginate'
import { getPageRange, paginate } from '@/cms/utils/paginate'
import { Icon } from '@/common/Icon'
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

const pageSize = 50

type AuthorWithPostCount = Person & { posts: number }

export interface AuthorsPageParams extends ParsedUrlQuery {
  page: string
}

export interface AuthorsPageProps {
  dictionary: Dictionary
  authors: Page<AuthorWithPostCount>
}

/**
 * Creates authors pages.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<AuthorsPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getPersonIds(locale)
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
 * Provides metadata and translations for authors page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<AuthorsPageParams>,
): Promise<GetStaticPropsResult<AuthorsPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const page = Number(context.params?.page)
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const authors = paginate(await getPersons(locale), pageSize)[page - 1]!
  const authorsWithPostCount = (
    await Promise.all(
      authors.items.map(async (author) => {
        const postsWithAuthor = await getPostPreviewsByAuthorId(
          author.id,
          locale,
        )

        return {
          ...author,
          posts: postsWithAuthor.length,
        }
      }),
    )
  ).filter((author) => author.posts > 0) // FIXME: paginate after filtering - needs caching!

  return {
    props: {
      dictionary,
      authors: { ...authors, items: authorsWithPostCount },
    },
  }
}

/**
 * Authors page.
 */
export default function AuthorsPage(props: AuthorsPageProps): JSX.Element {
  const { authors } = props

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={t('common.page.authors')}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="flex flex-col w-full max-w-screen-xl px-4 py-8 mx-auto space-y-10 xs:py-16 xs:px-8">
        <PageTitle>{t('common.authors')}</PageTitle>
        <AuthorsList authors={authors.items} />
      </PageContent>
    </Fragment>
  )
}

interface AuthorsListProps {
  authors: Array<AuthorWithPostCount>
}

/**
 * Authors list.
 */
function AuthorsList(props: AuthorsListProps): JSX.Element | null {
  const { authors } = props

  if (authors.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-col space-y-4">
      {authors.map((author) => {
        return (
          <li key={author.id}>
            <Link href={routes.author({ id: author.id })}>
              <a className="flex items-center space-x-1.5">
                <Icon icon={AvatarIcon} className="flex-shrink-0 w-6 h-6" />
                <span>
                  {getFullName(author)} ({author.posts})
                </span>
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
