import React from 'react'
import { FaFilePdf } from 'react-icons/fa'

import IconContainer from 'components/IconContainer/IconContainer'

const EventSessionSynthesis = ({ synthesis }) => {
  if (!synthesis) return null

  return (
    <a
      href={synthesis.publicURL}
      className="link-download"
      title="Download the session synthesis"
    >
      <IconContainer>
        <FaFilePdf size="1.5em" color="white" />
      </IconContainer>
    </a>
  )
}

export default EventSessionSynthesis
