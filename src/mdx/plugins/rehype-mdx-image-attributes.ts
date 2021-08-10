import type * as Hast from 'hast'
import type { MDXJsxFlowElement } from 'hast-util-to-estree'
import sizeOf from 'image-size'
import type { Transformer } from 'unified'
import visit from 'unist-util-visit'
import type { VFile } from 'vfile'

import { copyAsset } from '@/mdx/utils/copyAsset'

/**
 * Rehype plugin which copies image assets referenced in an mdx `image` attribute,
 * and adds width and height.
 *
 * Currently only handles attribute with relative file path as plain string,
 * i.e. no expressions or template literals.
 *
 * TODO: add blur placeholder.
 */
export default function attacher(): Transformer {
  return transformer

  async function transformer(tree: Hast.Node, file: VFile) {
    const imageBlurPromises: Array<Promise<void>> = []

    visit(tree, 'mdxJsxFlowElement', visitor)

    await Promise.all(imageBlurPromises)

    function visitor(node: MDXJsxFlowElement) {
      const attribute = node.attributes.find((attribute) => {
        return 'name' in attribute && attribute.name === 'image'
      })
      if (attribute == null) return

      const src = attribute.value
      if (typeof src !== 'string') return

      const paths = copyAsset(src, file.path)
      if (paths == null) return
      const { publicPath, srcFilePath } = paths

      /** When the image does not exist this will throw. */
      const { width, height } = sizeOf(srcFilePath)

      const imageSrcProps = {
        type: 'ObjectExpression',
        properties: [
          {
            type: 'Property',
            key: {
              type: 'Identifier',
              name: 'src',
            },
            value: {
              type: 'Literal',
              value: publicPath,
            },
            kind: 'init',
          },
          {
            type: 'Property',
            key: {
              type: 'Identifier',
              name: 'width',
            },
            value: {
              type: 'Literal',
              value: width,
            },
            kind: 'init',
          },
          {
            type: 'Property',
            key: {
              type: 'Identifier',
              name: 'height',
            },
            value: {
              type: 'Literal',
              value: height,
            },
            kind: 'init',
          },
        ],
      }

      attribute.value = {
        type: 'mdxJsxAttributeValueExpression',
        value: `{ src: "${publicPath}", width: {${width}}, height: {${height}} }`,
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            comments: [],
            body: [
              {
                type: 'ExpressionStatement',
                expression: imageSrcProps,
              },
            ],
          },
        },
      }
    }
  }
}
