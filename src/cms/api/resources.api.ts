import { type Event, type EventPreview } from "@/cms/api/events.api";
import { type Post, type PostPreview } from "@/cms/api/posts.api";

export type Resource = Event | Post;
export type ResourcePreview = EventPreview | PostPreview;

export type ResourceKind = Resource["kind"];
