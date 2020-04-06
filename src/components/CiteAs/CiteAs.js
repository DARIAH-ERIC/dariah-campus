import React from 'react'
import clsx from 'clsx'

import styles from './CiteAs.module.css'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'
import { slugify } from 'utils/slugify'

const CiteAs = ({ children, className, left, title, frontmatter }) => {
  // for some reason, frontmatter.slug doesn't work here
  // tested with Controlled Vocabularies and SKOS
  // had to slugify the title
  const path = createPath(getBasePath('post'), slugify(frontmatter.title))
  const dataCite =
    frontmatter.authors.map(author => author.name).join(', ') +
    ' (' +
    frontmatter.citationYear +
    '): ' +
    frontmatter.title +
    '. Version ' +
    frontmatter.version +
    '. DARIAH-Campus. [Training resource]. https://campus.dariah.eu' +
    path

  function copyToClipboard() {
    var dummy = document.createElement('input')
    document.body.appendChild(dummy)
    dummy.setAttribute('value', dataCite)
    dummy.select()
    document.execCommand('copy')
    document.body.removeChild(dummy)
  }

  return (
    <div
      className={clsx(
        styles.container,
        left && styles.containerLeft,
        className
      )}
    >
      <div className={styles.citeAs}>
        <h2 className={styles.citeAsHeading}>{title || 'Cite As'}</h2>

        <ul className={(styles.border, styles.items)}>
          <li className={styles.item}>{dataCite}</li>
          <li>
            <button onClick={() => copyToClipboard()}>Copy to Clipboard</button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default CiteAs
