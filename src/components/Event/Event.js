import React from 'react'

import EventFooter from 'components/EventFooter/EventFooter'
import EventHome from 'components/EventHome/EventHome'
import EventOverlay from 'components/EventOverlay/EventOverlay'
import EventSessions from 'components/EventSessions/EventSessions'
import EventSideNav from 'components/EventSideNav/EventSideNav'

import './styles/base.scss'

const Event = ({ about, index, prep, sessions, downloads }) => {
  const [overlay, setOverlay] = React.useState(null)

  const showAboutOverlay = () => {
    setOverlay(about.body)
  }

  const showPrepOverlay = () => {
    setOverlay(prep.body)
  }

  const onDismiss = () => {
    setOverlay(null)
  }

  const social = index.frontmatter.social.reduce((acc, link) => {
    acc[link.name] = link.url
    return acc
  }, {})

  return (
    <>
      <EventHome
        index={index}
        sessions={sessions.nodes}
        showAboutOverlay={showAboutOverlay}
        showPrepOverlay={showPrepOverlay}
        social={social}
      />
      <div className="body__borders">
        <EventSessions sessions={sessions.nodes} downloads={downloads.nodes} />
        <EventSideNav sessions={sessions.nodes} />
      </div>
      <EventFooter
        license={index.frontmatter.license}
        partners={index.frontmatter.partners}
        download={index.frontmatter.synthesis}
        showAboutOverlay={showAboutOverlay}
        showPrepOverlay={showPrepOverlay}
        social={social}
      />
      {overlay ? (
        <EventOverlay overlay={overlay} onDismiss={onDismiss} />
      ) : null}
    </>
  )
}

export default Event
