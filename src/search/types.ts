import { type CoursePreview } from "@/cms/api/courses.api";
import { type EventPreview } from "@/cms/api/events.api";
import { type PostPreview } from "@/cms/api/posts.api";
import { type ResourceKind } from "@/cms/api/resources.api";

// TODO: central place for `type` (from cms/collection maybe)
type IndexedObject = IndexedCourse | IndexedEvent | IndexedResource;
export type IndexedType = IndexedObject["type"];

/**
 * Resource fields indexed with Algolia.
 */
export interface IndexedResource
	extends Pick<PostPreview, "abstract" | "date" | "id" | "lang" | "title"> {
	type: "resources";
	kind: ResourceKind;
	objectID: string;
	authors: Array<Pick<PostPreview["authors"][number], "firstName" | "id" | "lastName">>;
	tags: Array<Pick<PostPreview["tags"][number], "id" | "name">>;
}

/**
 * Course fields indexed with Algolia.
 */
export interface IndexedCourse
	extends Pick<CoursePreview, "abstract" | "date" | "id" | "lang" | "title"> {
	type: "courses";
	objectID: string;
	tags: Array<Pick<CoursePreview["tags"][number], "id" | "name">>;
}

/**
 * Event fields indexed with Algolia.
 */
export interface IndexedEvent
	extends Pick<EventPreview, "abstract" | "date" | "id" | "lang" | "title"> {
	type: "events";
	objectID: string;
	tags: Array<Pick<EventPreview["tags"][number], "id" | "name">>;
}
