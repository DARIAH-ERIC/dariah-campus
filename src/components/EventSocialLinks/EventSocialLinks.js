import React from 'react'
import {
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaTwitter,
  FaGooglePlus,
} from 'react-icons/fa'

import IconContainer from 'components/IconContainer/IconContainer'

const EventSocialLinks = ({ social }) => (
  <ul className="home__share">
    {social.twitter && (
      <li style={{ marginRight: '1rem' }}>
        <a
          href={social.twitter}
          className="home__share__twitter"
          aria-label="Share on Twitter"
        >
          <IconContainer>
            <FaTwitter />
          </IconContainer>
        </a>
      </li>
    )}
    {social.website && (
      <li style={{ marginRight: '1rem' }}>
        <a href={social.website} aria-label="Visit website">
          <IconContainer>
            <FaGlobe />
          </IconContainer>
        </a>
      </li>
    )}
    {social.facebook && (
      <li style={{ marginRight: '1rem' }}>
        <a
          href={social.facebook}
          className="home__share__facebook"
          aria-label="Share on Facebook"
        >
          <IconContainer>
            <FaFacebook />
          </IconContainer>
        </a>
      </li>
    )}
    {social.googleplus && (
      <li style={{ marginRight: '1rem' }}>
        <a
          href={social.googleplus}
          className="home__share__googleplus"
          aria-label="Share on Google+"
        >
          <IconContainer>
            <FaGooglePlus />
          </IconContainer>
        </a>
      </li>
    )}
    {social.email && (
      <li style={{ marginRight: '1rem' }}>
        <a href={social.email} aria-label="Contact">
          <IconContainer>
            <FaEnvelope />
          </IconContainer>
        </a>
      </li>
    )}
  </ul>
)

export default EventSocialLinks
