import type { EditorComponentOptions } from 'netlify-cms-core'

/**
 * Netlify CMS richtext editor widget for EventSessionDownload component.
 */
export const eventSessionDownloadEditorWidget: EditorComponentOptions = {
  id: 'EventSessionDownload',
  label: 'Download',
  fields: [
    {
      name: 'href',
      label: 'File',
      widget: 'file',
      // @ts-expect-error Missing in upstream type.
      media_folder:
        // '../../{{media_folder}}/../../documents/cms/events/{{slug}}',
        '../../public/assets/documents/cms/events/{{slug}}',
      public_folder:
        // '{{public_folder}}/../../documents/cms/events/{{slug}}',
        '/assets/documents/cms/events/{{slug}}',
    },
    {
      name: 'label',
      label: 'Label',
      widget: 'string',
      // @ts-expect-error Missing in upstream type.
      required: false,
    },
  ],
  pattern: /^<Download([^]*?)\/>/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attrs = match[1]!

    const href = /href="([^"]*)"/.exec(attrs)
    const label = /label="([^"]*)"/.exec(attrs)

    return {
      href: href ? href[1] : undefined,
      label: label ? label[1] : undefined,
    }
  },
  toBlock(data) {
    let attrs = ''

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.href) attrs += ` href="${data.href}"`
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data.label) attrs += ` label="${data.label}"`

    return `<Download${attrs} />`
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `Download`
  },
}
