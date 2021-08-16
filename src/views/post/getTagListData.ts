import type { Tag } from '@/cms/api/tags.api'

export type TagListItem = Pick<Tag, 'id' | 'name'>

/**
 * Provides minimal data necessary for tag list view.
 */
export function getTagListData(tags: Array<Tag>): Array<TagListItem> {
  return tags.map((tag) => {
    return {
      id: tag.id,
      name: tag.name,
    }
  })
}
