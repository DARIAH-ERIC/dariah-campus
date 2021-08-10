import type { Event, EventPreview } from '@/cms/api/events.api'
import type { Post, PostPreview } from '@/cms/api/posts.api'

export type Resource = Post | Event
export type ResourcePreview = PostPreview | EventPreview

export type ResourceKind = Resource['kind']
