import React from 'react'
import Image from 'gatsby-image'
import { FaPlayCircle, FaFlickr, FaTwitter, FaFilePdf } from 'react-icons/fa'
import clsx from 'clsx'

import styles from './EventFooter.module.css'

// FIXME: This is essentially the same nav as in EventHome.EventNav
const EventFooterNav = ({
  download,
  hasAboutOverlay,
  hasPrepOverlay,
  showAboutOverlay,
  showPrepOverlay,
  social,
}) => (
  <ul className="footer__links">
    {hasAboutOverlay ? (
      <li>
        <button
          onClick={showAboutOverlay}
          className={clsx('link-popin', styles.buttonAsLink)}
        >
          About
        </button>
      </li>
    ) : null}
    {hasPrepOverlay ? (
      <li>
        <button
          onClick={showPrepOverlay}
          className={clsx('link-popin', styles.buttonAsLink)}
        >
          How to prepare
        </button>
      </li>
    ) : null}
    {social.flickr && (
      <li>
        <a href={social.flickr}>
          <FaFlickr size="0.75em" style={{ marginRight: '0.4rem' }} />
          See the photos
        </a>
      </li>
    )}
    {social.video && (
      <li>
        <a href={social.video}>
          <FaPlayCircle size="0.75em" style={{ marginRight: '0.4rem' }} />
          Watch the video
        </a>
      </li>
    )}
    {social.twitter && (
      <li>
        <a href={social.twitter}>
          <FaTwitter size="0.75em" style={{ marginRight: '0.4rem' }} />
          Read the Storify
        </a>
      </li>
    )}
    {download ? (
      <li className="download">
        <a href={download.publicURL}>
          <FaFilePdf size="0.75em" style={{ marginRight: '0.4rem' }} />
          Download the full synthesis (PDF, {download.prettySize})
        </a>
      </li>
    ) : null}
  </ul>
)

const EventPartners = ({ partners }) => (
  <ul className="footer__partners">
    {partners
      ? partners.map((partner, i) => (
          <li key={i} style={{ flex: 1, alignItems: 'center', height: '5rem' }}>
            <a
              href={partner.url}
              style={{ width: '100%', height: '100%', display: 'flex' }}
            >
              {partner.logo ? (
                partner.logo.image ? (
                  <Image
                    fluid={partner.logo.image.fluid}
                    alt={partner.name}
                    className={styles.partnerImage}
                    imgStyle={{ objectFit: 'contain' }}
                  />
                ) : (
                  <img
                    className={styles.partnerImage}
                    src={partner.logo.publicURL}
                  />
                )
              ) : null}
            </a>
          </li>
        ))
      : null}
  </ul>
)

const EventFooter = ({
  download,
  hasAboutOverlay,
  hasPrepOverlay,
  license,
  partners,
  showAboutOverlay,
  showPrepOverlay,
  social,
}) => (
  <div id="footer" className="clearfix">
    <div style={{ paddingLeft: '6.25%', paddingRight: '6.25%' }}>
      <div className="footer__credits">
        {license ? <p>{license.name}</p> : null}
      </div>

      <EventFooterNav
        download={download}
        hasAboutOverlay={hasAboutOverlay}
        hasPrepOverlay={hasPrepOverlay}
        showAboutOverlay={showAboutOverlay}
        showPrepOverlay={showPrepOverlay}
        social={social}
      />

      <h3 className="h3">Organisation</h3>

      <EventPartners partners={partners} />
    </div>
  </div>
)

export default EventFooter
