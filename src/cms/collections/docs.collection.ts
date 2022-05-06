import type { CmsCollection } from 'netlify-cms-core'

/**
 * Docs collection.
 */
export const collection: CmsCollection = {
  name: 'docs',
  label: 'Documentation pages',
  label_singular: 'Documentation page',
  description: '',
  folder: 'content/docs',
  path: '{{slug}}/index',
  format: 'frontmatter',
  extension: 'mdx',
  create: true,
  delete: false,
  slug: '{{slug}}',
  media_folder: 'images',
  public_folder: 'images',
  preview_path: 'docs/{{dirname}}',
  editor: { preview: true },
  sortable_fields: ['commit_date', 'title', 'commit_author'],
  fields: [
    {
      name: 'title',
      label: 'Title',
      hint: '',
    },
    {
      name: 'order',
      label: 'Order',
      hint: '',
      widget: 'number',
    },
    {
      name: 'body',
      label: 'Content',
      hint: '',
      widget: 'markdown',
      editor_components: [
        'image',
        'Figure',
        'code-block',
        'Grid',
        'Download',
        'Video',
        'SideNote',
      ],
    },
  ],
}
