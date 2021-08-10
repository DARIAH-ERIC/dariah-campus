import type * as Mdast from 'mdast'
import retext from 'retext'
import smartypants from 'retext-smartypants'
import type { Transformer } from 'unified'
import type * as Unist from 'unist'
import visit from 'unist-util-visit'

const options = { dashes: 'oldschool' }
const processor = retext().use(smartypants, options)

/**
 * Transforms regular punctuation marks with typographic quotes, dashes and ellipses.
 *
 * @see https://github.com/retextjs/retext-smartypants
 */
export default function attacher(): Transformer {
  return transformer

  function transformer(tree: Unist.Node) {
    visit(tree, 'text', onNode)

    function onNode(node: Mdast.Text) {
      node.value = String(processor.processSync(node.value))
    }
  }
}
