import { type EventPreview } from "@/cms/api/events.api";
import { getEventPreviews } from "@/cms/api/events.api";
import { type Locale } from "@/i18n/i18n.config";

/**
 * Returns metadata for events filtered by author id.
 */
export async function getEventPreviewsByAuthorId(
	id: string,
	locale: Locale,
): Promise<Array<EventPreview>> {
	const postPreviews = await getEventPreviews(locale);

	const eventsByAuthor = postPreviews.filter((post) => {
		return post.authors.some((author) => {
			return author.id === id;
		});
	});

	return eventsByAuthor;
}

/**
 * Returns metadata for events filtered by tag id.
 */
export async function getEventPreviewsByTagId(
	id: string,
	locale: Locale,
): Promise<Array<EventPreview>> {
	const postPreviews = await getEventPreviews(locale);

	const eventsByTag = postPreviews.filter((post) => {
		return post.tags.some((tag) => {
			return tag.id === id;
		});
	});

	return eventsByTag;
}
