import React from 'react'

const EventSideNav = ({ sessions }) => (
  <div
    id="nav-anchors"
    className="sticky-position sticky-anchors no-mobile"
    style={{ zIndex: 1, bottom: 0 }}
  >
    <ol style={{ position: 'sticky', top: '10rem' }}>
      <li>
        <a href="#body" className="internal-link">
          <strong>Scroll to top</strong>
        </a>
      </li>
      {sessions.map((session, i) => (
        <li key={session.frontmatter.number}>
          <a href={`#session-${session.frontmatter.number}`}>
            <strong>{session.frontmatter.title}</strong>
          </a>
        </li>
      ))}
      <li>
        <a href="#footer" className="internal-link">
          <strong>Scroll to bottom</strong>
        </a>
      </li>
    </ol>
  </div>
)

export default EventSideNav
