import type { Post as PostData } from '@/cms/api/posts.api'
import { ExternalResource } from '@/cms/components/ExternalResource'
import { Figure } from '@/cms/components/Figure'
import { Quiz } from '@/cms/components/quiz/Quiz'
import { VideoCard } from '@/cms/components/VideoCard'
import { PageTitle } from '@/common/PageTitle'
import { ResponsiveImage } from '@/common/ResponsiveImage'
import { useI18n } from '@/i18n/useI18n'
import { Mdx } from '@/mdx/Mdx'
import type { IsoDateString } from '@/utils/ts/aliases'
import { Authors } from '@/views/post/Authors'
import { EditLink } from '@/views/post/EditLink'
import { PostSocialShareLinks } from '@/views/post/PostSocialShareLinks'
import { Tags } from '@/views/post/Tags'

export interface ResourceProps {
  resource: PostData
  lastUpdatedAt: IsoDateString | null
  isPreview?: boolean
}

export function Resource(props: ResourceProps): JSX.Element {
  const { resource, lastUpdatedAt, isPreview } = props
  const { metadata } = resource.data
  const { title, authors, tags, featuredImage } = metadata

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
      <div className="prose-sm prose sm:prose">
        {featuredImage != null ? (
          typeof featuredImage === 'string' ? (
            <img src={featuredImage} alt="" />
          ) : (
            <ResponsiveImage {...featuredImage} alt="" priority />
          )
        ) : null}
        <Mdx
          code={resource.code}
          components={{
            Image: ResponsiveImage,
            Figure,
            Quiz,
            VideoCard,
            ExternalResource,
          }}
        />
      </div>
      <footer className="pt-2">
        {isPreview !== true ? <PostSocialShareLinks post={resource} /> : null}
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
            collection="posts"
            id={resource.id}
            className="text-sm flex justify-end items-center space-x-1.5 text-neutral-500"
          >
            <span className="text-right">
              {t('common.suggestChangesToResource')}
            </span>
          </EditLink>
        ) : null}
      </footer>
    </article>
  )
}
