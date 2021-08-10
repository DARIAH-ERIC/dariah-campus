import type { PostPreview } from '@/cms/api/posts.api'
import { getPostPreviews } from '@/cms/api/posts.api'
import type { Locale } from '@/i18n/i18n.config'

/**
 * Returns metadata for posts filtered by author id.
 */
export async function getPostPreviewsByAuthorId(
  id: string,
  locale: Locale,
): Promise<Array<PostPreview>> {
  const postPreviews = await getPostPreviews(locale)

  const postsByAuthor = postPreviews.filter((post) =>
    post.authors.some((author) => author.id === id),
  )

  return postsByAuthor
}

/**
 * Returns metadata for posts filtered by tag id.
 */
export async function getPostPreviewsByTagId(
  id: string,
  locale: Locale,
): Promise<Array<PostPreview>> {
  const postPreviews = await getPostPreviews(locale)

  const postsByTag = postPreviews.filter((post) =>
    post.tags.some((tag) => tag.id === id),
  )

  return postsByTag
}

/**
 * Returns metadata for posts filtered by category id.
 */
export async function getPostPreviewsByCategoryId(
  id: string,
  locale: Locale,
): Promise<Array<PostPreview>> {
  const postPreviews = await getPostPreviews(locale)

  const postsByCategory = postPreviews.filter((post) =>
    post.categories.some((category) => category.id === id),
  )

  return postsByCategory
}
