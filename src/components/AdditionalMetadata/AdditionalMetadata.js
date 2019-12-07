import React from 'react'

import styles from './AdditionalMetadata.module.css'

const AdditionalMetadata = ({ metadata }) => (
  <div className={styles.metadata}>
    {metadata.dateModified && (
      <span>Last modified: {metadata.dateModified}</span>
    )}
    {metadata.license && (
      <span>
        License:{' '}
        <a href={metadata.license.url} rel="noopener noreferrer">
          {metadata.license.name}
        </a>
      </span>
    )}
    {metadata.version && <span>Version: {metadata.version}</span>}
  </div>
)

export default AdditionalMetadata
