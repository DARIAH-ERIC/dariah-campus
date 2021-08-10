import Image from 'next/image'
import type { ImageProps } from 'next/image'
import Link from 'next/link'

import { Svg as AvatarIcon } from '@/assets/icons/user.svg'
import type { Course as CourseData } from '@/cms/api/courses.api'
import { getFullName } from '@/cms/utils/getFullName'
import { Icon } from '@/common/Icon'
import { PageTitle } from '@/common/PageTitle'
import { useI18n } from '@/i18n/useI18n'
import { Mdx } from '@/mdx/Mdx'
import { routes } from '@/navigation/routes.config'
import type { IsoDateString } from '@/utils/ts/aliases'
import { EditLink } from '@/views/post/EditLink'
import { ResourcePreviewCard } from '@/views/post/ResourcePreviewCard'

export interface CourseProps {
  course: CourseData
  lastUpdatedAt: IsoDateString | null
  isPreview?: boolean
}

export function Course(props: CourseProps): JSX.Element {
  const { course, lastUpdatedAt, isPreview } = props
  const { metadata } = course.data
  const {
    title,
    date: publishDate,
    editors: authors = [], // FIXME: editors / authors
    tags,
    resources,
  } = metadata

  const { t, formatDate } = useI18n()

  return (
    <article className="w-full mx-auto space-y-16 max-w-80ch">
      <header className="space-y-10 text-center">
        <dl>
          {tags.length > 0 ? (
            <div>
              <dt className="inline sr-only">{t('common.tags')}:</dt>
              <dd className="inline">
                <ul className="inline text-xs font-bold tracking-wide uppercase text-primary-600">
                  {tags.map((tag, index) => {
                    return (
                      <li key={tag.id} className="inline">
                        <Link href={routes.tag({ id: tag.id })}>
                          <a className="transition hover:text-primary-700 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                            <span className={index !== 0 ? 'ml-1' : undefined}>
                              {tag.name}
                            </span>
                          </a>
                        </Link>
                        {index !== tags.length - 1 ? ', ' : null}
                      </li>
                    )
                  })}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
        <PageTitle>{title}</PageTitle>
        <dl className="grid items-center grid-cols-2 py-4 text-sm border-t border-b text-neutral-500 border-neutral-200 text-left">
          <div className="space-y-1">
            {authors.length > 0 ? (
              <div>
                <dt className="sr-only">{t('common.authors')}</dt>
                <dd>
                  <ul className="space-y-2">
                    {authors.map((author) => {
                      return (
                        <li key={author.id}>
                          <div className="flex items-center space-x-2">
                            {author.avatar != null ? (
                              <Image
                                src={author.avatar}
                                alt=""
                                className="object-cover w-8 h-8 rounded-full"
                                layout="fixed"
                                width={32}
                                height={32}
                              />
                            ) : (
                              <Icon
                                icon={AvatarIcon}
                                className="flex-shrink-0 object-cover w-8 h-8 rounded-full"
                              />
                            )}
                            <Link href={routes.author({ id: author.id })}>
                              <a className="underline">{getFullName(author)}</a>
                            </Link>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </dd>
              </div>
            ) : null}
          </div>
          <div className="space-y-1 text-right">
            <div>
              <dt className="sr-only">{t('common.publishDate')}</dt>
              <dd>
                <time dateTime={publishDate}>
                  {formatDate(new Date(publishDate), undefined, {
                    dateStyle: 'long',
                  })}
                </time>
              </dd>
            </div>
          </div>
        </dl>
      </header>
      <div className="prose-sm prose max-w-none sm:prose sm:max-w-none">
        <Mdx code={course.code} components={{ Image: ResponsiveImage }} />
      </div>
      {resources.length > 0 ? (
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">{t('common.resources')}</h2>
          <ul className="space-y-8">
            {resources.map((resource) => {
              return (
                <ResourcePreviewCard key={resource.id} resource={resource} />
              )
            })}
          </ul>
        </div>
      ) : null}
      <footer>
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

function ResponsiveImage(props: ImageProps) {
  return <Image layout="responsive" sizes="800px" {...props} alt={props.alt} />
}
