import type { ResourcePreview } from '@/cms/api/resources.api'

type AuthorListItem = Pick<
  ResourcePreview['authors'][number],
  'id' | 'firstName' | 'lastName' | 'avatar'
>
export interface ResourceListItem
  extends Pick<ResourcePreview, 'id' | 'kind' | 'title' | 'date' | 'abstract'> {
  type: Pick<ResourcePreview['type'], 'id'>
  authors: Array<AuthorListItem>
}

/**
 * Provides minimal data necessary for resource list view.
 */
export function getResourceListData(
  resources: Array<ResourcePreview>,
): Array<ResourceListItem> {
  return resources.map((resource) => {
    return {
      id: resource.id,
      kind: resource.kind,
      type: resource.type,
      title: resource.shortTitle ?? resource.title,
      date: resource.date,
      abstract: resource.abstract,
      authors: resource.authors.map((author) => {
        const authorListItem: AuthorListItem = {
          id: author.id,
          lastName: author.lastName,
        }
        if (author.firstName != null) {
          authorListItem.firstName = author.firstName
        }
        if (author.avatar != null) {
          authorListItem.avatar = author.avatar
        }
        return authorListItem
      }),
    }
  })
}
