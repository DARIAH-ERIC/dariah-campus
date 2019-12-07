import React from 'react'
import Image from 'gatsby-image'
import { FaEnvelope, FaGlobe, FaLinkedin, FaTwitter } from 'react-icons/fa'

import OrcidIcon from '../../elements/OrcidIcon/OrcidIcon'

import styles from './EventSessionSpeaker.module.css'

const EventSessionSpeaker = ({ children, speaker, speakers }) => {
  const person =
    typeof speaker === 'string'
      ? speakers.find(person => person.slug === speaker)
      : speaker

  if (!person) return null

  return (
    <li key={person.slug}>
      {person.avatar ? (
        <Image
          fluid={person.avatar.image.fluid}
          style={{ position: 'absolute', width: '9.375vw' }}
          className={styles.sessionSpeakerAvatar}
        />
      ) : null}

      <div className="list-speakers__bio" style={{ color: '#1e396c' }}>
        <h3 className="h3">{person.name}</h3>

        {children ? (
          <div className={styles.bio}>{children}</div>
        ) : (
          <div
            className={styles.bio}
            dangerouslySetInnerHTML={{
              __html: person.descriptionHtml,
            }}
          />
        )}

        <ul className="list-speakers__links">
          {person.linkedin ? (
            <li>
              <a href={`https://linkedin.com/in/${person.linkedin}`}>
                <FaLinkedin size="0.75em" style={{ marginRight: '0.4rem' }} />
                {person.linkedin}
              </a>
            </li>
          ) : null}
          {person.twitter ? (
            <li>
              <a href={`https://twitter.com/${person.twitter}`}>
                <FaTwitter size="0.75em" style={{ marginRight: '0.4rem' }} />
                {person.twitter}
              </a>
            </li>
          ) : null}
          {person.email ? (
            <li>
              <a href={`mailto:${person.email}`} className="email">
                <FaEnvelope size="0.75em" style={{ marginRight: '0.4rem' }} />
                {person.email}
              </a>
            </li>
          ) : null}
          {person.website ? (
            <li>
              <a href={person.website} className="website">
                <FaGlobe size="0.75em" style={{ marginRight: '0.4rem' }} />
                Personal Website
              </a>
            </li>
          ) : null}
          {person.orcid ? (
            <li>
              <a href={`https://orcid.org/${person.orcid}`}>
                <OrcidIcon
                  width="0.75em"
                  height="0.75em"
                  style={{ marginRight: '0.4rem' }}
                />
                ORCID
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </li>
  )
}

export default EventSessionSpeaker
