import Image from 'next/image'
import Link from 'next/link'

import { Svg as AvatarIcon } from '@/assets/icons/user.svg'
import type { Post as PostData } from '@/cms/api/posts.api'
import { getFullName } from '@/cms/utils/getFullName'
import { Icon } from '@/common/Icon'
import { useI18n } from '@/i18n/useI18n'
import { routes } from '@/navigation/routes.config'

export interface AuthorsAsideProps {
  authors: PostData['data']['metadata']['authors']
}

export function AuthorsAside(props: AuthorsAsideProps): JSX.Element | null {
  const { authors } = props
  const { t } = useI18n()

  if (authors.length === 0) return null

  return (
    <dl className="flex flex-col space-y-2 text-sm text-neutral-500">
      <dt className="text-xs font-bold tracking-wide uppercase text-neutral-600">
        {t('common.authors')}
      </dt>
      {authors.map((author) => {
        return (
          <dd key={author.id}>
            <div className="flex items-center space-x-1.5">
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
                <a className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                  {getFullName(author)}
                </a>
              </Link>
            </div>
          </dd>
        )
      })}
    </dl>
  )
}
