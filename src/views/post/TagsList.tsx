import Link from 'next/link'

import type { TagListItem } from './getTagListData'

import { useI18n } from '@/i18n/useI18n'
import { routes } from '@/navigation/routes.config'

export interface TagsListProps {
  tags: Array<TagListItem & { posts: number }>
}

/**
 * Tags list.
 */
export function TagsList(props: TagsListProps): JSX.Element {
  const { tags } = props

  const { t } = useI18n()

  return (
    <ul className="flex flex-wrap justify-center px-4 py-4 text-sm md:py-6">
      {tags.map((tag) => {
        return (
          <li key={tag.id}>
            <Link href={routes.tag({ id: tag.id })}>
              <a className="flex transition hover:bg-primary-700 focus-visible:bg-primary-700 px-3 py-1.5 mr-1 mb-1 text-center text-white rounded-full bg-primary-600 space-x-1">
                <span>{tag.name}</span>
                <span className="-mt-px text-xs">
                  {tag.posts}
                  <span className="sr-only"> {t('common.resources')}</span>
                </span>
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
