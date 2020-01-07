import React from 'react'

// We cannot create links for editors and contributors,
// because they are not guaranteed to have an author page
// (only resource-authors have those)

import styles from './AdditionalMetadata.module.css'

const AdditionalMetadata = ({ metadata }) => (
  <div className={styles.metadata}>
    {metadata.authors && (
      <span>
        Authors: {metadata.authors.map(author => author.name).join(', ')}
      </span>
    )}
    {metadata.contributors && (
      <span>
        Contributors:{' '}
        {metadata.contributors.map(contributor => contributor.name).join(', ')}
      </span>
    )}
    {metadata.domain && <span>Domain: {metadata.domain}</span>}
    {metadata.editors && (
      <span>
        Editors: {metadata.editors.map(editor => editor.name).join(', ')}
      </span>
    )}
    {metadata.lang && <span>Language: {metadata.lang}</span>}
    {metadata.dateModified && (
      <span>Last modified: {metadata.dateModified}</span>
    )}
    {metadata.license && (
      <span>
        License:{' '}
        <a
          href={metadata.license.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {metadata.license.name}
        </a>
      </span>
    )}
    {metadata.date && <span>Published: {metadata.date}</span>}
    {metadata.type && <span>Resource type: {metadata.type.name}</span>}
    {metadata.categories && (
      <span>
        Sources: {metadata.categories.map(category => category.name).join(', ')}
      </span>
    )}
    {metadata.targetGroup && <span>Target group: {metadata.targetGroup}</span>}
    {metadata.tags && (
      <span>Topics: {metadata.tags.map(tag => tag.name).join(', ')}</span>
    )}
    {metadata.version && <span>Version: {metadata.version}</span>}
  </div>
)

export default AdditionalMetadata
