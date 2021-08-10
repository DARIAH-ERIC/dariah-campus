import type { CmsCollection } from 'netlify-cms-core'

/**
 * Tags collection.
 */
export const collection: CmsCollection = {
  name: 'tags',
  label: 'Tags',
  label_singular: 'Tag',
  description: '',
  folder: 'content/tags',
  identifier_field: 'name',
  format: 'yml',
  create: true,
  delete: false,
  slug: '{{slug}}',
  media_folder: '../../{{media_folder}}/tags',
  public_folder: '{{public_folder}}/tags',
  preview_path: 'tag/{{slug}}',
  sortable_fields: ['commit_date', 'name'],
  fields: [
    {
      name: 'name',
      label: 'Name',
      hint: '',
    },
    {
      name: 'description',
      label: 'Description',
      hint: '',
      widget: 'text',
    },
  ],
}
