import type { EditorComponentOptions } from 'netlify-cms-core'

import { decodeQuotes, encodeQuotes } from '@/cms/utils/quotes'

/**
 * Netlify CMS richtext editor widget for ExternalResource component.
 */
export const externalResourceEditorWidget: EditorComponentOptions = {
  id: 'ExternalResource',
  label: 'ExternalResource',
  fields: [
    {
      name: 'title',
      label: 'Title',
      widget: 'hidden',
      // @ts-expect-error Missing in upstream type.
      default: 'Interested in learning more?',
    },
    {
      name: 'subtitle',
      label: 'Call to action',
      widget: 'string',
      // @ts-expect-error Missing in upstream type.
      default: 'Check out <PLEASE ENTER NAME OF RESOURCE>',
    },
    {
      name: 'url',
      label: 'URL',
      widget: 'string',
      // FIXME: this.props.onValidate is not a function
      // pattern: ['^[a-zA-Z][a-zA-Z\\d+\\-.]*:', 'Must be a valid URL'],
    },
  ],
  pattern: /^<ExternalResource([^]*?)\/>/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const title = /title="([^"]*)"/.exec(attrs)
    const subtitle = /subtitle="([^"]*)"/.exec(attrs)
    const url = /url="([^"]*)"/.exec(attrs)

    return {
      title: title ? decodeQuotes(title[1]) : undefined,
      subtitle: subtitle ? decodeQuotes(subtitle[1]) : undefined,
      url: url ? url[1] : undefined,
    }
  },
  toBlock(data) {
    let attrs = ''

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.title) attrs += ` title="${encodeQuotes(data.title)}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.subtitle) attrs += ` subtitle="${encodeQuotes(data.subtitle)}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.url) attrs += ` url="${data.url}"`

    return `<ExternalResource${attrs} />`
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `ExternalResource`
  },
}
