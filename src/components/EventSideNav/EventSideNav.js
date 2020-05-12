import React from 'react'
import Link from 'components/Link/Link'

const EventSideNav = ({ sessions }) => (
  <div
    id="nav-anchors"
    className="sticky-position sticky-anchors no-mobile"
    style={{ zIndex: 1, bottom: 0 }}
  >
    <ol style={{ position: 'sticky', top: '10rem' }}>
      <li>
        <Link to="#body" className="internal-link">
          <strong>Scroll to top</strong>
        </Link>
      </li>
      {sessions.map((session, i) => (
        <li key={session.frontmatter.number}>
          <Link to={`#session-${session.frontmatter.number}`}>
            <strong>{session.frontmatter.title}</strong>
          </Link>
        </li>
      ))}
      <li>
        <Link to="#footer" className="internal-link">
          <strong>Scroll to bottom</strong>
        </Link>
      </li>
    </ol>
  </div>
)

export default EventSideNav
