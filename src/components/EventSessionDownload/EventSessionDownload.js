import React from 'react'
import { FaFilePdf } from 'react-icons/fa'

const EventSessionDownload = ({ children, download, downloads = [] }) => {
  let file = null

  if (typeof download === 'string') {
    const fileName = download.replace(/^[./]*docs\//, '')
    file = downloads.find(d => d.base === fileName)
  } else {
    file = download
  }

  if (!file) return null

  return (
    <div className="session__downloads">
      <a href={file.publicURL} className="link-download">
        <span>
          <FaFilePdf
            color="#ed6f59"
            size="1.8em"
            style={{ marginRight: '0.4rem' }}
          />
        </span>
        <strong>
          {children ? children : 'Download the slides'} <br />
          <span>(PDF, {file.prettySize})</span>
        </strong>
      </a>
    </div>
  )
}

export default EventSessionDownload
