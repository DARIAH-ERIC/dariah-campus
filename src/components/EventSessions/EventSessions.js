import React from 'react'

import EventSession from 'components/EventSession/EventSession'

const EventSessions = ({ sessions, downloads }) => (
  <div className="pos-r sticky-position-container">
    {sessions.map(session => (
      <EventSession
        key={session.frontmatter.number}
        session={session}
        downloads={downloads}
      />
    ))}
  </div>
)

export default EventSessions
