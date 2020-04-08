import React from 'react'
import clsx from 'clsx'

import styles from './CiteAs.module.css'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

const CiteAs = ({ children, className, left, title, frontmatter }) => {
  // All resources get a citation
  // only remote resources have remoteUrl in YAML metadata
  // DESIR videos are considered hosted (hence no remoteUrl)
  const citedAuthor = frontmatter.authors.map(author => author.name).join(', ')
  const citedYear = frontmatter.remoteCitationYear
    ? ' (' + frontmatter.remoteCitationYear + '). '
    : ' (' + frontmatter.citationYear + '). '
  const citedTitle = frontmatter.title + '. '
  const citedVersion = frontmatter.version
    ? 'Version ' + frontmatter.version + '. '
    : ''
  const citedPublisher = frontmatter.remoteUrl
    ? frontmatter.categories
        .filter(cat => cat.slug !== 'dariah')
        .map(cat => cat.host) + '. '
    : 'DARIAH-Campus. '
  const citedRestype = '[' + frontmatter.type.name + ']. '
  const citedUrl = frontmatter.remoteUrl
    ? frontmatter.remoteUrl
    : 'https://campus.dariah.eu' +
      createPath(getBasePath('post'), frontmatter.slug)
  const dataCite =
    citedAuthor +
    citedYear +
    citedTitle +
    citedVersion +
    citedPublisher +
    citedRestype +
    citedUrl

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
