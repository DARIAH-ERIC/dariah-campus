import React from 'react'
import { FaFlickr, FaPlayCircle, FaTwitter, FaFilePdf } from 'react-icons/fa'
import clsx from 'clsx'

import styles from './EventNav.module.css'

const EventNav = ({ download, showAboutOverlay, showPrepOverlay }) => (
  <div>
    <ul className="home__links">
      <li>
        <button
          onClick={showAboutOverlay}
          className={clsx('link-popin', styles.buttonAsLink)}
        >
          <span>About</span>
        </button>
      </li>
      <li>
        <button
          onClick={showPrepOverlay}
          className={clsx('link-popin', styles.buttonAsLink)}
        >
          <span>How to prepare</span>
        </button>
      </li>
      <li>
        <a href="https://www.flickr.com/photos/151019225@N04/sets/72157679126801606/">
          <FaFlickr size="0.75em" style={{ marginRight: '1rem' }} />
          <span>See the photos</span>
        </a>
      </li>
      <li>
        <a href="#">
          <FaPlayCircle size="0.75em" style={{ marginRight: '1rem' }} />
          <span>Watch the video</span>
        </a>
      </li>
      <li>
        <a href="https://storify.com/Natct23452346/dariah-humanities-at-scale-winter-school-in-praha#publicize">
          <FaTwitter size="0.75em" style={{ marginRight: '1rem' }} />
          <span>Read the Storify</span>
        </a>
      </li>
      {download ? (
        <li className="download">
          <a href={download.publicURL}>
            <FaFilePdf size="0.75em" style={{ marginRight: '1rem' }} />
            <span>
              Download the full synthesis (PDF, {download.prettySize})
            </span>
          </a>
        </li>
      ) : null}
    </ul>

    <p className="home__more">
      You can annotate and discuss all the material here with the{' '}
      <a href="https://hypothes.is/">hypothes.is</a> plugin.
    </p>
  </div>
)

export default EventNav
