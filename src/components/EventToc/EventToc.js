import React from 'react'

const EventToc = ({ sessions }) => (
  <ul className="home__index">
    {sessions.map((session, i) => (
      <li key={i}>
        <a href={`#session-${i + 1}`}>
          <small>
            <span>
              <i>Session</i> {i + 1}
            </span>
          </small>
          <strong>{session.frontmatter.title}</strong>
        </a>
      </li>
    ))}
  </ul>
)

export default EventToc
