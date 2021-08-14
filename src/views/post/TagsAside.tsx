import Link from 'next/link'

import type { Post as PostData } from '@/cms/api/posts.api'
import { useI18n } from '@/i18n/useI18n'
import { routes } from '@/navigation/routes.config'

export interface TagsAsideProps {
  tags: PostData['data']['metadata']['tags']
}

export function TagsAside(props: TagsAsideProps): JSX.Element | null {
  const { tags } = props

  const { t } = useI18n()

  if (tags.length === 0) return null

  return (
    <dl className="flex flex-col space-y-1.5 text-sm text-neutral-500">
      <dt className="text-xs font-bold tracking-wide uppercase text-neutral-600">
        {t('common.tags')}
      </dt>
      <dd className="inline">
        <ul className="inline text-xs tracking-wide uppercase">
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
    </dl>
  )
}
