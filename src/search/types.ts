import type { CoursePreview } from '@/cms/api/courses.api'
import type { EventPreview } from '@/cms/api/events.api'
import type { PostPreview } from '@/cms/api/posts.api'
import type { ResourceKind } from '@/cms/api/resources.api'

// TODO: central place for `type` (from cms/collection maybe)
type IndexedObject = IndexedCourse | IndexedResource | IndexedEvent
export type IndexedType = IndexedObject['type']

/**
 * Resource fields indexed with Algolia.
 */
export interface IndexedResource
  extends Pick<PostPreview, 'id' | 'title' | 'date' | 'lang' | 'abstract'> {
  type: 'resources'
  kind: ResourceKind
  objectID: string
  authors: Array<
    Pick<PostPreview['authors'][number], 'id' | 'firstName' | 'lastName'>
  >
  tags: Array<Pick<PostPreview['tags'][number], 'id' | 'name'>>
  body: string
}

/**
 * Course fields indexed with Algolia.
 */
export interface IndexedCourse
  extends Pick<CoursePreview, 'id' | 'title' | 'date' | 'lang' | 'abstract'> {
  type: 'courses'
  objectID: string
  tags: Array<Pick<CoursePreview['tags'][number], 'id' | 'name'>>
  body: string
}

/**
 * Event fields indexed with Algolia.
 */
export interface IndexedEvent
  extends Pick<EventPreview, 'id' | 'title' | 'date' | 'lang' | 'abstract'> {
  type: 'events'
  objectID: string
  tags: Array<Pick<EventPreview['tags'][number], 'id' | 'name'>>
  body: string
}
