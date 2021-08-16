import type { ResourceListItem } from '@/views/post/getResourceListData'
import { ResourcePreviewCard } from '@/views/post/ResourcePreviewCard'
import { useFakeMasonry } from '@/views/post/useFakeMasonry'

export interface ResourcesListProps {
  resources: Array<ResourceListItem>
}

/**
 * Lists one page of resources.
 */
export function ResourcesList(props: ResourcesListProps): JSX.Element {
  const { resources } = props

  const columns = useFakeMasonry(resources)

  if (columns != null) {
    return (
      <ul className="flex space-x-6">
        {columns.map((resources, index) => {
          return (
            <div key={index} className="flex-1 space-y-6">
              {resources.map((resource) => {
                return (
                  <li key={resource.id}>
                    <ResourcePreviewCard resource={resource} />
                  </li>
                )
              })}
            </div>
          )
        })}
      </ul>
    )
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => {
        return (
          <li key={resource.id}>
            <ResourcePreviewCard resource={resource} />
          </li>
        )
      })}
    </ul>
  )
}
