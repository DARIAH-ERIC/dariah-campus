import type { EditorComponentOptions } from 'netlify-cms-core'

/**
 * Netlify CMS richtext editor widget for linking other resources.
 */
export const resourceLinkWidget: EditorComponentOptions = {
  id: 'ResourceLink',
  label: 'ResourceLink',
  fields: [
    {
      name: 'id',
      label: 'Resource',
      widget: 'relation',
      /* @ts-expect-error Missing on upstream type. */
      collection: 'posts',
      value_field: '{{slug}}',
      search_fields: ['title'],
      display_fields: ['title'],
    },
    { name: 'label', label: 'Label', widget: 'string' },
  ],
  pattern: /^<ResourceLink(.*?)\/>/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const id = /id="([^"]*)"/.exec(attrs)
    const label = /label="([^"]*)"/.exec(attrs)

    return {
      id: id ? id[1] + '/index' : undefined,
      label: label ? label[1] : undefined,
    }
  },
  toBlock(data) {
    const id = data.id?.slice(0, -6 /* '/index' */)
    const label = data.label

    if (id == null || label == null) return ''

    return `<ResourceLink type="posts" id="${id}" label="${label}" />`
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `ResourceLink`
  },
}
