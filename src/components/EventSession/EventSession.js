import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

import EventSessionDownload from 'components/EventSessionDownload/EventSessionDownload'
import EventSessionHeading from 'components/EventSessionHeading/EventSessionHeading'
import EventSessionLink from 'components/EventSessionLink/EventSessionLink'
import EventSessionSpeaker from 'components/EventSessionSpeaker/EventSessionSpeaker'
import EventSessionSpeakers from 'components/EventSessionSpeakers/EventSessionSpeakers'
import EventSessionSynthesis from 'components/EventSessionSynthesis/EventSessionSynthesis'
import EventSessionTitle from 'components/EventSessionTitle/EventSessionTitle'
import Link from 'components/Link/Link'

const EventSession = ({ session, downloads }) => {
  const { number, speakers, synthesis, title } = session.frontmatter

  return (
    <div className="session" id={`session-${number}`}>
      <div className="session__heading">
        <EventSessionTitle>{title}</EventSessionTitle>
        <EventSessionSynthesis synthesis={synthesis} />
      </div>

      <div className="session__core">
        <MDXProvider
          components={{
            a: Link,
            // We currently use the h1 separately in SessionTitle, so don't render it again
            h1: () => null,
            h2: EventSessionHeading,
            h3: ({ children, ...props }) => (
              <h3 className="h3" {...props}>
                {children}
              </h3>
            ),
            p: props => (
              <p
                {...props}
                style={{
                  lineHeight: 1.35,
                  color: '#1e396c',
                }}
              />
            ),
            ul: props => (
              <ul
                {...props}
                className="list-standard"
                style={{ color: '#1e396c' }}
              />
            ),
            ol: props => (
              <ol
                {...props}
                className="list-ordered"
                style={{ color: '#1e396c' }}
              />
            ),
            Download: props => (
              <EventSessionDownload {...props} downloads={downloads} />
            ),
            Heading: EventSessionHeading,
            Link: EventSessionLink,
            Speaker: props => (
              <EventSessionSpeaker {...props} speakers={speakers} />
            ),
            Speakers: props => (
              <EventSessionSpeakers {...props} speakers={speakers} />
            ),
            Title: EventSessionTitle,
          }}
        >
          <MDXRenderer>{session.body}</MDXRenderer>
        </MDXProvider>

        {synthesis ? (
          <EventSessionDownload download={synthesis}>
            Download the complete session {number} synthesis
          </EventSessionDownload>
        ) : null}
      </div>
    </div>
  )
}

export default EventSession
