import type { EditorComponentOptions } from 'netlify-cms-core'

import { types as options } from '@/cms/components/SideNote'

/**
 * Netlify CMS richtext editor widget for SideNote component.
 */
export const sideNoteEditorWidget: EditorComponentOptions = {
  id: 'SideNote',
  label: 'SideNote',
  fields: [
    {
      name: 'type',
      label: 'Type',
      widget: 'select',
      // @ts-expect-error Missing in upstream types.
      options,
      default: 'note',
    },
    { name: 'title', label: 'Title', widget: 'string' },
    {
      name: 'children',
      label: 'Content',
      widget: 'markdown',
      // FIXME: https://github.com/netlify/netlify-cms/issues/5514
      // @ts-expect-error Missing in upstream types.
      editor_components: ['image', 'code-block'],
      // modes: ['raw'],
    },
  ],
  pattern: /^<SideNote(.*?)>\n([^]*?)\n<\/SideNote>/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const type = /type="([^"]*)"/.exec(attrs)
    const title = /title="([^"]*)"/.exec(attrs)

    return {
      type: type ? type[1] : undefined,
      title: title ? title[1] : undefined,
      children: match[2],
    }
  },
  toBlock(data) {
    let attrs = ''

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.type) attrs += ` type="${data.type}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.title) attrs += ` title="${data.title}"`

    return `<SideNote${attrs}>
${data.children ?? ''}
</SideNote>`
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `SideNote`
  },
}
