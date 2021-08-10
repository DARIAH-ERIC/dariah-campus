import { useMemo, useRef } from 'react'
import type { ReactNode } from 'react'

import { CodeMirror } from '@/cms/components/quiz/CodeMirror'
import { QuizCardStatus, useQuiz } from '@/cms/components/quiz/Quiz'
import { QuizCardLayout } from '@/cms/components/quiz/QuizCardLayout'
import { useCodeMirror } from '@/cms/components/quiz/useCodeMirror'

export interface XmlCodeEditorProps {
  children?: ReactNode
  code: string
  solution: string
  /** @default "document" */
  validate?: 'document' | 'selection'
}

/**
 * XML code editor with syntax highlighting.
 */
export function XmlCodeEditor(props: XmlCodeEditorProps): JSX.Element {
  const quiz = useQuiz()

  const ref = useRef<HTMLDivElement>(null)
  const { getDocument, getSelection } = useCodeMirror(ref, props.code)
  const solution = useMemo(
    () => createDocumentFragment(normalizeWhitespace(props.solution)),
    [props.solution],
  )

  function onValidate() {
    const input =
      props.validate === 'selection' ? getSelection() : getDocument()

    /**
     * Use a document fragment, because `DOMParser` requires full documents,
     * i.e. the following won't work:
     * ```js
     * new DOMParser().parseFromString('<p>Hello</p><p>World</p>')
     * ```
     * However, `createDocumentFragment` does not seem to handle xml declarations.
     */
    try {
      const inputDoc = createDocumentFragment(normalizeWhitespace(input))
      const isCorrect =
        solution === null || inputDoc === null
          ? false
          : inputDoc.isEqualNode(solution)

      quiz.setStatus(
        isCorrect ? QuizCardStatus.CORRECT : QuizCardStatus.INCORRECT,
      )
    } catch {
      quiz.setStatus(QuizCardStatus.INCORRECT)
    }
  }

  const component = <CodeMirror ref={ref} />

  return (
    <QuizCardLayout component={component} onValidate={onValidate}>
      {props.children}
    </QuizCardLayout>
  )
}

XmlCodeEditor.isQuizCard = true

/**
 * Parses xml string into document fragment (or document in case the string
 * tarts with a xml processing instruction).
 */
function createDocumentFragment(xml: string) {
  if (typeof window === 'undefined') return null

  /**
   * We prefer to use document fragments, because they don't require a tree,
   * i.e. allow to have to sibling elements without a parent as input
   * (e.g. `<p>One</p><p>Two</p>`).
   *
   * However, document fragments throw when the input includes xml processing instructions.
   * In that case we parse into a full document. We don't do this by default, because
   * `DOMParser` requires a full valid tree with one root as input.
   */
  if (xml.trimStart().startsWith('<?')) {
    const doc = new DOMParser().parseFromString(xml, 'text/xml')
    /** `DOMParser` does not throw on errors, but puts a `parsererror` as root element. */
    if (doc.documentElement.tagName === 'parsererror') {
      throw new Error(
        doc.documentElement.textContent ?? 'Error parsing XML document.',
      )
    }
    return doc.documentElement
  }

  /** Creates a XMLDocument. */
  const doc = new Document()
  const template = doc.createElement('template')
  /** Uses XML fragment parsing. */
  template.innerHTML = xml
  /**
   * While html templates have the document fragment on `template.content`,
   * in xml mode the `template` itself poses as the content container.
   */
  return template
}

/**
 * Removes whitespace-only text nodes, trims leading/trailing whitespace from text nodes
 * and collapses multiple consecutive whitespace characters into one space.
 *
 * Whitespace in inline formatting contexts is not preserved correctly, but this should
 * not matter here.
 */
function normalizeWhitespace(html: string) {
  return html.trim().replace(/>\s+/g, '>').replace(/<\s+/g, '<')
}

// function normalizeWhitespaceDom(dom) {
//   for (let i = 0; i < dom.childNodes.length; i++) {
//     const node = dom.childNodes[i]
//     if (node.nodeType === Node.COMMENT_NODE) {
//       node.remove()
//       i--
//     } else if (node.nodeType === Node.TEXT_NODE) {
//       node.textContent = node.textContent.trim()
//       if (node.textContent.length === 0) {
//         node.remove()
//         i--
//       }
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//       normalizeWhitespaceDom(node)
//     }
//   }
// }
