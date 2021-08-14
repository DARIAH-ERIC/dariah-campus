import Link from 'next/link'

import { Svg as FacebookIcon } from '@/assets/icons/brand/facebook.svg'
import { Svg as TwitterIcon } from '@/assets/icons/brand/twitter.svg'
import type { Post } from '@/cms/api/posts.api'
import { Icon } from '@/common/Icon'
import { useI18n } from '@/i18n/useI18n'
import { useSiteMetadata } from '@/metadata/useSiteMetadata'
import { routes } from '@/navigation/routes.config'
import { createUrl } from '@/utils/createUrl'

export interface PostSocialShareLinks {
  post: Post
}

export function PostSocialShareLinks(props: PostSocialShareLinks): JSX.Element {
  const { url: siteUrl, twitter } = useSiteMetadata()

  const { post } = props
  const { data, id } = post
  const { metadata } = data

  const url = String(
    createUrl({
      baseUrl: siteUrl,
      pathname: routes.resource({ kind: post.kind, id }).pathname,
    }),
  )

  const { t } = useI18n()

  return (
    <div className="flex items-center justify-center my-8 space-x-4 text-neutral-500">
      <Link
        href={String(
          createUrl({
            baseUrl: 'https://www.twitter.com',
            pathname: '/intent/tweet',
            query: {
              text: metadata.title,
              url,
              via: twitter,
              related:
                twitter != null
                  ? String(
                      createUrl({
                        baseUrl: 'https://www.twitter.com',
                        pathname: twitter,
                      }),
                    )
                  : undefined,
            },
          }),
        )}
      >
        <a className="block transition rounded-full hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
          <Icon icon={TwitterIcon} />
          <span className="sr-only">
            {t('common.shareLink', { platform: 'Twitter' })}
          </span>
        </a>
      </Link>
      <Link
        href={String(
          createUrl({
            baseUrl: 'https://www.facebook.com',
            pathname: '/sharer/sharer.php',
            query: {
              u: url,
              title: metadata.title,
            },
          }),
        )}
      >
        <a className="block transition rounded-full hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
          <Icon icon={FacebookIcon} />
          <span className="sr-only">
            {t('common.shareLink', { platform: 'Facebook' })}
          </span>
        </a>
      </Link>
    </div>
  )
}
