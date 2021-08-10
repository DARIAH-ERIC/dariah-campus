import type * as Hast from 'hast'
import type { MDXJsxTextElement } from 'hast-util-to-estree'
import sizeOf from 'image-size'
import type { Transformer } from 'unified'
import type * as Unist from 'unist'
import visit from 'unist-util-visit'
import type { VFile } from 'vfile'

import { copyAsset } from '@/mdx/utils/copyAsset'
import { generateBlurDataUrl } from '@/mdx/utils/generateBlurDataUrl'

/**
 * Rehype plugin which copies linked image assets, and adds width and height.
 */
export default function attacher(): Transformer {
  return transformer

  async function transformer(tree: Hast.Node, file: VFile) {
    const imageBlurPromises: Array<Promise<void>> = []

    visit(tree, 'element', visitor)

    await Promise.all(imageBlurPromises)

    function visitor(
      node: Hast.Element,
      index: number,
      parent: Unist.Parent | undefined,
    ) {
      if (node.tagName !== 'img') return

      const paths = copyAsset(node.properties?.src, file.path)
      if (paths == null) return
      const { publicPath, srcFilePath } = paths

      node.properties = node.properties ?? {}
      node.properties.src = publicPath
      node.properties.loading = 'lazy'

      /** When the image does not exist this will throw. */
      const dimensions = sizeOf(srcFilePath)
      node.properties.width = dimensions.width
      node.properties.height = dimensions.height

      /**
       * TODO: we could also simply use component mapping img=>Image,
       * just check that we have width/height props, otherwise, render regular img.
       *
       * This would also be more in line with what the `rehype-mdx-image-attributes` plugin does.
       */
      const imageComponent: MDXJsxTextElement = {
        type: 'mdxJsxTextElement',
        name: 'Image',
        children: [],
        attributes: [],
      }

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
              value: dimensions.width,
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
              value: dimensions.height,
            },
            kind: 'init',
          },
        ],
      }

      imageComponent.attributes.push({
        type: 'mdxJsxAttribute',
        name: 'src',
        value: {
          type: 'mdxJsxAttributeValueExpression',
          value: `{ src: "${publicPath}", width: {${dimensions.width}}, height: {${dimensions.height}} }`,
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
        },
      })

      if (typeof node.properties.alt === 'string') {
        imageComponent.attributes.push({
          type: 'mdxJsxAttribute',
          name: 'alt',
          value: node.properties.alt,
        })
      }

      if (typeof node.properties.title === 'string') {
        imageComponent.attributes.push({
          type: 'mdxJsxAttribute',
          name: 'title',
          value: node.properties.title,
        })
      }

      imageBlurPromises.push(
        generateBlurDataUrl(srcFilePath).then((dataUrl) => {
          // if added to expression, need to update expression `value`
          // imageSrcProps.properties.push({
          //   type: 'Property',
          //   key: {
          //     type: 'Identifier',
          //     name: 'blurDataURL',
          //   },
          //   value: {
          //     type: 'Literal',
          //     value: dataUrl,
          //   },
          //   kind: 'init',
          // })
          imageComponent.attributes.push({
            type: 'mdxJsxAttribute',
            name: 'blurDataURL',
            value: dataUrl,
          })
          imageComponent.attributes.push({
            type: 'mdxJsxAttribute',
            name: 'placeholder',
            value: 'blur',
          })
        }),
      )

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parent!.children.splice(index, 1, imageComponent)
    }
  }
}
