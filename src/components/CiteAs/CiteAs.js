import React from 'react'
import clsx from 'clsx'

import styles from './CiteAs.module.css'
import Button from 'elements/Button/Button'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

const CiteAs = ({ children, className, left, title, frontmatter }) => {
  // All resources get a citation
  // only remote resources have remoteUrl in YAML metadata
  // DESIR videos are considered hosted (hence no remoteUrl)

  // concat contributors, if any, to the end of the authors
  const comboAuthors = frontmatter.contributors
    ? [...frontmatter.authors, ...frontmatter.contributors]
    : frontmatter.authors

  const citedAuthors = comboAuthors
    .map(author => author.name)
    .join(', ')
    .replace(/,(?!.*,)/gim, ' and')

  const citedEditors = frontmatter.editors
    ? 'Edited by ' +
      frontmatter.editors
        .map(editor => editor.name)
        .join(', ')
        .replace(/,(?!.*,)/gim, ' and') +
      '. '
    : ''

  const citedYear = frontmatter.remoteCitationYear
    ? ' (' + frontmatter.remoteCitationYear + '). '
    : ' (' + frontmatter.citationYear + '). '
  const citedTitle = frontmatter.title.slice(-1).match(/[!?]/)
    ? frontmatter.title + ' '
    : frontmatter.title + '. '
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
    citedAuthors +
    citedYear +
    citedTitle +
    citedVersion +
    citedEditors +
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
          <li className={styles.item}>
            {citedAuthors + citedYear} {citedTitle}{' '}
            {citedVersion + citedEditors + citedPublisher + citedRestype}
            <span className={styles.citedUrl}>{citedUrl}</span>
          </li>
          <li>
            <Button
              className={styles.citeAsButton}
              onClick={() => copyToClipboard()}
            >
              Copy citation
            </Button>
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
