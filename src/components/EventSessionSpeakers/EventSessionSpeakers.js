import React from 'react'

const EventSessionSpeakers = ({ children, speakers = [] }) => (
  <div className="session__speakers">
    <h3 className="h2">
      <strong>Speaker{speakers.length > 1 ? 's' : null} </strong>
      <span> for this session</span>
    </h3>
    <ul className="list-speakers">{children}</ul>
  </div>
)

export default EventSessionSpeakers
