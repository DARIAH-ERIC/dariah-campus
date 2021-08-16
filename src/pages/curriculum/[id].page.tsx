import type { ParsedUrlQuery } from 'querystring'

import { SchemaOrg as SchemaOrgMetadata } from '@stefanprobst/next-page-metadata'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

import { Svg as DocumentIcon } from '@/assets/icons/document-text.svg'
import {
  getCourseById,
  getCourseFilePath,
  getCourseIds,
} from '@/cms/api/courses.api'
import type { Course as CourseData } from '@/cms/api/courses.api'
import { getCoursePreviewsByTagId } from '@/cms/queries/courses.queries'
import { getLastUpdatedTimestamp } from '@/cms/utils/getLastUpdatedTimestamp'
import { pickRandom } from '@/cms/utils/pickRandom'
import { Icon } from '@/common/Icon'
import { PageContent } from '@/common/PageContent'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { DublinCore as DublinCoreMetadata } from '@/metadata/DublinCore'
import { Highwire as HighwireMetadata } from '@/metadata/Highwire'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { useSiteMetadata } from '@/metadata/useSiteMetadata'
import { routes } from '@/navigation/routes.config'
import { createUrl } from '@/utils/createUrl'
import type { IsoDateString } from '@/utils/ts/aliases'
import { AuthorsAside } from '@/views/post/AuthorsAside'
import { Course } from '@/views/post/Course'
import type { CourseListItem } from '@/views/post/getCourseListData'
import { getCourseListData } from '@/views/post/getCourseListData'
import { TagsAside } from '@/views/post/TagsAside'

const RELATED_COURSES_COUNT = 4

export interface CoursePageParams extends ParsedUrlQuery {
  id: string
}

export interface CoursePageProps {
  dictionary: Dictionary
  course: CourseData
  related: Array<CourseListItem>
  lastUpdatedAt: IsoDateString | null
}

/**
 * Creates page for every course.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<CoursePageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getCourseIds(locale)

        return ids.map((id) => {
          return {
            params: { id },
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
 * Provides course content and metadata, and translations for course page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<CoursePageParams>,
): Promise<GetStaticPropsResult<CoursePageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const { id } = context.params as CoursePageParams

  const course = await getCourseById(id, locale)

  const coursesWithSharedTags = (
    await Promise.all(
      course.data.metadata.tags.map((tag) => {
        return getCoursePreviewsByTagId(tag.id, locale)
      }),
    )
  )
    .flat()
    .filter((course) => {
      return course.id !== id
    })
  const related = getCourseListData(
    pickRandom(coursesWithSharedTags, RELATED_COURSES_COUNT),
  )

  const lastUpdatedAt = await getLastUpdatedTimestamp(
    getCourseFilePath(id, locale),
  )

  return {
    props: {
      dictionary,
      course,
      related,
      lastUpdatedAt,
    },
  }
}

/**
 * Course page.
 */
export default function CoursePage(props: CoursePageProps): JSX.Element {
  const { course, related, lastUpdatedAt } = props
  const { metadata } = course.data

  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()
  const siteMetadata = useSiteMetadata()

  return (
    <Fragment>
      <Metadata
        title={metadata.title}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
        openGraph={{
          type: 'article',
        }}
      />
      <SchemaOrgMetadata
        schema={{
          '@type': 'LearningResource',
          url: canonicalUrl,
          headline: metadata.title,
          datePublished: metadata.date,
          abstract: metadata.abstract,
          inLanguage: metadata.lang,
          editor: metadata.editors?.map((editor) => {
            return {
              '@type': 'Person',
              familyName: editor.lastName,
              givenName: editor.firstName,
            }
          }),
          version: metadata.version,
          // license: metadata.licence.url,
          // image: metadata.featuredImage,
          keywords: metadata.tags.map((tag) => {
            return tag.name
          }),
          publisher: {
            '@type': 'Organization',
            name: siteMetadata.title,
            description: siteMetadata.description,
            url: siteMetadata.url,
            logo: siteMetadata.image.publicPath,
            sameAs:
              siteMetadata.twitter != null
                ? String(
                    createUrl({
                      pathname: siteMetadata.twitter,
                      baseUrl: 'https://twitter.com',
                    }),
                  )
                : undefined,
          },
        }}
      />
      <HighwireMetadata
        url={canonicalUrl}
        title={metadata.title}
        date={metadata.date}
        // editors={metadata.editors?.map((editor) => getFullName(editor))}
        abstract={metadata.abstract}
        lang={metadata.lang}
        siteTitle={siteMetadata.title}
      />
      <DublinCoreMetadata
        title={metadata.title}
        date={metadata.date}
        // editors={metadata.editors?.map((editor) => getFullName(editor))}
        abstract={metadata.abstract}
        lang={metadata.lang}
        // licence={metadata.licence.name}
        tags={metadata.tags.map((tag) => {
          return tag.name
        })}
        siteTitle={siteMetadata.title}
      />
      <PageContent className="grid w-full max-w-screen-lg px-4 py-8 mx-auto space-y-10 xs:py-16 xs:px-8 2xl:space-y-0 2xl:grid-cols-content-layout 2xl:gap-x-10 2xl:max-w-none">
        <aside
          className="sticky hidden w-full max-w-xs max-h-screen px-8 py-8 space-y-8 overflow-y-auto text-sm top-24 text-neutral-500 2xl:flex 2xl:flex-col justify-self-end"
          style={{
            maxHeight: 'calc(100vh - 12px - var(--page-header-height))',
          }}
        >
          {metadata.editors != null ? (
            <AuthorsAside authors={metadata.editors} />
          ) : null}
          <TagsAside tags={metadata.tags} />
          <LessonsList resources={metadata.resources} />
        </aside>
        <div className="min-w-0">
          <Course course={course} lastUpdatedAt={lastUpdatedAt} />
          <RelatedCourses courses={related} />
        </div>
      </PageContent>
    </Fragment>
  )
}

interface LessonsListProps {
  resources: CourseData['data']['metadata']['resources']
}

function LessonsList(props: LessonsListProps) {
  const { resources } = props

  const { t } = useI18n()

  if (resources.length === 0) return null

  return (
    <nav aria-label={t('common.lessonsInCourse')} className="w-full space-y-2">
      <h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
        {t('common.lessonsInCourse')}
      </h2>
      <ol className="space-y-2">
        {resources.map((resource) => {
          return (
            <li key={resource.id}>
              <Link href={routes.resource({ kind: 'posts', id: resource.id })}>
                <a className="flex items-center text-sm space-x-1.5 transition hover:text-primary-600 relative focus:outline-none rounded focus-visible:ring focus-visible:ring-primary-600">
                  {resource.shortTitle ?? resource.title}
                </a>
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

interface RelatedCoursesProps {
  courses: Array<CourseListItem>
}

/**
 * List of related courses.
 */
function RelatedCourses(props: RelatedCoursesProps) {
  const { courses } = props

  const { t } = useI18n()

  if (courses.length === 0) return null

  return (
    <nav className="w-full py-12 mx-auto my-12 space-y-3 border-t border-neutral-200 max-w-80ch">
      <h2 className="text-2xl font-bold">{t('common.relatedCourses')}</h2>
      <ul className="flex flex-col space-y-4">
        {props.courses.map((course) => {
          return (
            <li key={course.id}>
              <Link href={routes.course({ id: course.id })}>
                <a className="underline flex items-center space-x-1.5">
                  <Icon icon={DocumentIcon} className="flex-shrink-0 w-6 h-6" />
                  <span>{course.title}</span>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
