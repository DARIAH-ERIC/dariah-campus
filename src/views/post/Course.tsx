import type { Course as CourseData } from '@/cms/api/courses.api'
import { PageTitle } from '@/common/PageTitle'
import { ResponsiveImage } from '@/common/ResponsiveImage'
import { useI18n } from '@/i18n/useI18n'
import { Mdx } from '@/mdx/Mdx'
import type { IsoDateString } from '@/utils/ts/aliases'
import { Authors } from '@/views/post/Authors'
import { EditLink } from '@/views/post/EditLink'
import { ResourcePreviewCard } from '@/views/post/ResourcePreviewCard'
import { Tags } from '@/views/post/Tags'

export interface CourseProps {
  course: CourseData
  lastUpdatedAt: IsoDateString | null
  isPreview?: boolean
}

export function Course(props: CourseProps): JSX.Element {
  const { course, lastUpdatedAt, isPreview } = props
  const { metadata } = course.data
  const { title, editors: authors = [], tags, resources } = metadata

  const { t, formatDate } = useI18n()

  return (
    <article className="w-full mx-auto space-y-10 max-w-80ch">
      <header className="space-y-10">
        <PageTitle>{title}</PageTitle>
        <div className="py-10 space-y-6 border-t border-b 2xl:hidden">
          <Authors authors={authors} />
          <Tags tags={tags} />
        </div>
      </header>
      <div className="prose-sm prose max-w-none sm:prose sm:max-w-none">
        <Mdx code={course.code} components={{ Image: ResponsiveImage }} />
      </div>
      {resources.length > 0 ? (
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">{t('common.resources')}</h2>
          <ol className="space-y-8">
            {resources.map((resource) => {
              return (
                <ResourcePreviewCard key={resource.id} resource={resource} />
              )
            })}
          </ol>
        </div>
      ) : null}
      <footer className="pt-2">
        {lastUpdatedAt != null ? (
          <p className="text-sm text-right text-neutral-500">
            <span>{t('common.lastUpdated')}: </span>
            <time dateTime={lastUpdatedAt}>
              {formatDate(new Date(lastUpdatedAt), undefined, {
                dateStyle: 'medium',
              })}
            </time>
          </p>
        ) : null}
        {isPreview !== true ? (
          <EditLink
            collection="courses"
            id={course.id}
            className="text-sm flex justify-end items-center space-x-1.5 text-neutral-500"
          >
            <span className="text-right">
              {t('common.suggestChangesToCourse')}
            </span>
          </EditLink>
        ) : null}
      </footer>
    </article>
  )
}
