import React from 'react'
import Image from 'gatsby-image'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

import EventIntro from 'components/EventIntro/EventIntro'
import EventNav from 'components/EventNav/EventNav'
import EventSocialLinks from 'components/EventSocialLinks/EventSocialLinks'
import EventSubtitle from 'components/EventSubtitle/EventSubtitle'
import EventTitle from 'components/EventTitle/EventTitle'
import EventToc from 'components/EventToc/EventToc'
import Link from 'components/Link/Link'

import styles from './EventHome.module.css'

const EventHome = ({
  hasAboutOverlay,
  hasPrepOverlay,
  index,
  sessions,
  showAboutOverlay,
  showPrepOverlay,
  social,
}) => (
  <div
    id="body"
    className="home"
    style={{ height: '100vh', minHeight: '100vh' }}
  >
    {index.frontmatter.featuredImage ? (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
        }}
      >
        <Image
          fluid={index.frontmatter.featuredImage.image.fluid}
          style={{ height: '100%' }}
          className={styles.backgroundImage}
        />
      </div>
    ) : null}

    <div className="home__wrapper-1">
      <div className="home__wrapper-2">
        <div className="home__wrapper-3">
          <div className="home__main" style={{ position: 'relative' }}>
            {index.frontmatter.logo ? (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  width: '12rem',
                  left: '-3.25vw',
                }}
              >
                {index.frontmatter.logo.image ? (
                  <Image fluid={index.frontmatter.logo.image.fluid} />
                ) : (
                  <img src={index.frontmatter.logo.publicURL} alt="" />
                )}
              </div>
            ) : null}
            <MDXProvider
              components={{
                a: Link,
                h1: EventTitle,
                h2: EventSubtitle,
                p: EventIntro,
              }}
            >
              <MDXRenderer>{index.body}</MDXRenderer>
            </MDXProvider>

            <EventToc sessions={sessions} />
          </div>

          <div className="home__aside">
            <EventSocialLinks social={social} />
            <EventNav
              download={index.frontmatter.synthesis}
              hasAboutOverlay={hasAboutOverlay}
              hasPrepOverlay={hasPrepOverlay}
              showAboutOverlay={showAboutOverlay}
              showPrepOverlay={showPrepOverlay}
              social={social}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default EventHome
