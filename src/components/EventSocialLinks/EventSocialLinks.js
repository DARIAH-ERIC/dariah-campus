import React from 'react'
import {
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaTwitter,
  FaGooglePlus,
} from 'react-icons/fa'

import IconContainer from 'components/IconContainer/IconContainer'

const EventSocialLinks = () => (
  <ul className="home__share">
    <li style={{ marginRight: '1rem' }}>
      <a
        href="https://twitter.com/DARIAHeu"
        className="home__share__twitter"
        aria-label="Share on Twitter"
      >
        <IconContainer>
          <FaTwitter />
        </IconContainer>
      </a>
    </li>
    <li style={{ marginRight: '1rem' }}>
      <a href="http://dariah.eu/" aria-label="Visit website">
        <IconContainer>
          <FaGlobe />
        </IconContainer>
      </a>
    </li>
    <li style={{ marginRight: '1rem' }}>
      <a
        href="#"
        className="home__share__facebook"
        aria-label="Share on Facebook"
      >
        <IconContainer>
          <FaFacebook />
        </IconContainer>
      </a>
    </li>
    <li style={{ marginRight: '1rem' }}>
      <a
        href="#"
        className="home__share__googleplus"
        aria-label="Share on Google+"
      >
        <IconContainer>
          <FaGooglePlus />
        </IconContainer>
      </a>
    </li>
    <li style={{ marginRight: '1rem' }}>
      <a href="#" aria-label="Contact">
        <IconContainer>
          <FaEnvelope />
        </IconContainer>
      </a>
    </li>
  </ul>
)

export default EventSocialLinks
