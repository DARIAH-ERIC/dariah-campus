import type * as Hast from 'hast'
import type { MDXJsxTextElement, MDXJsxFlowElement } from 'hast-util-to-estree'
import type { Transformer } from 'unified'
import visit from 'unist-util-visit'
import type { VFile } from 'vfile'

import { copyAsset } from '@/mdx/utils/copyAsset'

/**
 * Rehype plugin which copies linked assets.
 */
export default function attacher(): Transformer {
  return transformer

  async function transformer(tree: Hast.Node, file: VFile) {
    visit(tree, 'element', onElement)

    function onElement(node: Hast.Element) {
      if (node.tagName !== 'a') return

      const paths = copyAsset(node.properties?.href, file.path)
      if (paths == null) return
      const { publicPath } = paths

      node.properties = node.properties ?? {}
      node.properties.href = publicPath
      node.properties.download = true
    }

    visit(tree, ['mdxJsxTextElement', 'mdxJsxFlowElement'], onMdxJsxElement)

    function onMdxJsxElement(node: MDXJsxTextElement | MDXJsxFlowElement) {
      if (node.name !== 'Download') return

      const urlAttribute = node.attributes.find(
        /** Ignore `MDXJsxExpressionAttribute`. */
        (attribute) => 'name' in attribute && attribute.name === 'url',
      )

      const paths = copyAsset(urlAttribute?.value, file.path, 'asset')
      if (paths == null) return
      const { publicPath } = paths

      if (urlAttribute != null) {
        urlAttribute.value = publicPath
      }
    }
  }
}
