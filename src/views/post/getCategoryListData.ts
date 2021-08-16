import type { Category } from '@/cms/api/categories.api'

export type CategoryListItem = Pick<
  Category,
  'id' | 'name' | 'description' | 'image'
>

/**
 * Provides minimal data necessary for category list view.
 */
export function getCategoryListData(
  categories: Array<Category>,
): Array<CategoryListItem> {
  return categories.map((category) => {
    const categoryListItem: CategoryListItem = {
      id: category.id,
      name: category.name,
      description: category.description,
    }
    if (category.image != null) {
      categoryListItem.image = category.image
    }
    return categoryListItem
  })
}
