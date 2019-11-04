import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import github from 'prism-react-renderer/themes/github'

const CodeBlock = ({ children, className }) => {
  const language = className ? className.replace(/language-/, '') : 'diff'

  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language}
      theme={github}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            overflowX: 'auto',
            padding: 'var(--padding-large)',
            margin: 'var(--margin-large) 0',
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
