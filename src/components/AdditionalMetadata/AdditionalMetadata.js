import React from 'react'

// We cannot create links for editors and contributors,
// because they are not guaranteed to have an author page
// (only resource-authors have those)
// import { createLinks } from 'utils/create-links'
// import { getBasePath } from 'utils/get-base-path'

import styles from './AdditionalMetadata.module.css'

const AdditionalMetadata = ({ metadata }) => (
  <div className={styles.metadata}>
    {metadata.contributors && (
      <span>
        Contributors:{' '}
        {metadata.contributors.map(contributor => contributor.name).join(', ')}
        {/* {createLinks(metadata.contributors, getBasePath('author'))} */}
      </span>
    )}
    {metadata.domain && <span>Domain: {metadata.domain}</span>}
    {metadata.editors && (
      <span>
        Editors: {metadata.editors.map(editor => editor.name).join(', ')}
        {/* {createLinks(metadata.editors, getBasePath('author'))} */}
      </span>
    )}
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
    {metadata.targetGroup && <span>Target group: {metadata.targetGroup}</span>}
    {metadata.version && <span>Version: {metadata.version}</span>}
  </div>
)

export default AdditionalMetadata
