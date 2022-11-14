import type { EditorComponentOptions } from 'netlify-cms-core'

import { decodeQuotes, encodeQuotes } from '@/cms/utils/quotes'

/**
 * Netlify CMS richtext editor widget for EventSessionLink component.
 */
export const eventSessionLinkEditorWidget: EditorComponentOptions = {
  id: 'EventSessionLink',
  label: 'Link',
  fields: [
    {
      name: 'href',
      label: 'File',
      widget: 'string',
      // pattern: ['^[a-zA-Z][a-zA-Z\\d+\\-.]*:', 'Must be a valid URL'],
    },
    {
      name: 'label',
      label: 'Label',
      widget: 'string',
      // @ts-expect-error Missing in upstream type.
      required: false,
    },
  ],
  pattern: /^<Link([^]*?)\/>/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const href = /href="([^"]*)"/.exec(attrs)
    const label = /label="([^"]*)"/.exec(attrs)

    return {
      href: href ? href[1] : undefined,
      label: label ? decodeQuotes(label[1]) : undefined,
    }
  },
  toBlock(data) {
    let attrs = ''

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.href) attrs += ` href="${data.href}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.label) attrs += ` label="${encodeQuotes(data.label)}"`

    return `<Link${attrs} />`
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `Link`
  },
}
