import React from 'react'
import clsx from 'clsx'

import styles from './CiteAs.module.css'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

const CiteAs = ({ children, className, left, title, frontmatter }) => {
  const path = createPath(getBasePath('post'), frontmatter.slug)
  // All resources get a citation
  // D-C 'source' (category) is not the same as publisher: for instance DESIR is source, but DARIAH-Campus is publisher.
  // also: we can't rely strictily on categories because some resources may be placed in two cateogries (DARIAH + ELEXIS), which can lead to confusion.
  // which is why we need a category: citePublisher
  // if there is no citePublisher, it will default to DARIAH-Campus

  // for dariahTeach content, we need to add authors!!!
  //
  //
  //

  function printPublisher(source) {
    const publ = ''
    switch (source) {
      case 'parthenos':
        return 'PARTHENOS Training Suite'
        break
      case 'desir':
        return 'DARIAH-Campus'
        break
      case 'dariah-teach':
        return 'DARIAH Teach'
        break
      default:
        return 'DARIAH-Campus'
        break
    }
  }

  const citeAuthor = frontmatter.authors.map(author => author.name).join(', ')
  const citeYear = ' (' + frontmatter.citationYear + '). '
  const citeTitle = frontmatter.title + '. '
  const citeVersion = frontmatter.version
    ? 'Version ' + frontmatter.version + '. '
    : ''
  const citePublisher = printPublisher(frontmatter.citePublisher) + '. '
  const citeRestype = '[' + frontmatter.type.name + ']. '
  const citeUrl = frontmatter.citeUrl
    ? frontmatter.citeUrl
    : 'https://campus.dariah.eu' + path

  const dataCite =
    citeAuthor +
    citeYear +
    citeTitle +
    citeVersion +
    citePublisher +
    citeRestype +
    citeUrl

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

        <h2 className={styles.citeAsHeading}>{'Reuse conditions'}</h2>

        <ul className={(styles.border, styles.items)}>
          <li className={styles.item}>
            Resources hosted on DARIAH-Campus are subjects to the{' '}
            <a href="/docs/dariah-campus-training-materials-reuse-charter">
              DARIAH-Campus Training Materials Reuse Charter
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default CiteAs
