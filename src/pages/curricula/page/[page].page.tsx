import type { ParsedUrlQuery } from 'querystring'

import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { Fragment } from 'react'

import type { CoursePreview } from '@/cms/api/courses.api'
import { getCoursePreviews, getCourseIds } from '@/cms/api/courses.api'
import type { Page } from '@/cms/utils/paginate'
import { getPageRange, paginate } from '@/cms/utils/paginate'
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
import { CoursesList } from '@/views/post/CoursesList'
import { Pagination } from '@/views/post/Pagination'

const pageSize = 12

export interface CoursesPageParams extends ParsedUrlQuery {
  page: string
}

export interface CoursesPageProps {
  dictionary: Dictionary
  courses: Page<CoursePreview>
}

/**
 * Creates courses pages.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<CoursesPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getCourseIds(locale)
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
 * Provides translations and metadata for courses page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<CoursesPageParams>,
): Promise<GetStaticPropsResult<CoursesPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const page = Number(context.params?.page)
  const coursePreviews = await getCoursePreviews(locale)
  const sortedCourses: Array<CoursePreview> = coursePreviews.sort((a, b) =>
    a.date > b.date ? -1 : 1,
  )

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const courses = paginate(sortedCourses, pageSize)[page - 1]!

  return {
    props: {
      dictionary,
      courses,
    },
  }
}

/**
 * Courses page.
 */
export default function CoursesPage(props: CoursesPageProps): JSX.Element {
  const { courses } = props

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={t('common.page.courses')}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="flex flex-col w-full max-w-screen-xl px-4 py-8 mx-auto space-y-10 xs:py-16 xs:px-8">
        <PageTitle>{t('common.courses')}</PageTitle>
        <CoursesList courses={courses.items} />
        <Pagination
          page={courses.page}
          pages={courses.pages}
          href={(page) => routes.courses({ page })}
        />
      </PageContent>
    </Fragment>
  )
}
