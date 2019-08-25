import React from 'react'
import { FaCloud } from 'react-icons/fa'

const Link = ({ link }) => (
  <a
    href={link}
    className="link-download"
    style={{ display: 'flex', alignItems: 'center' }}
  >
    <span>
      <FaCloud color="#ed6f59" size="1.8em" style={{ marginRight: '0.8rem' }} />
    </span>
    <strong>{link}</strong>
  </a>
)

const EventSessionLink = ({ link, links }) => (
  <div className="session__downloads">
    {links ? (
      links.map((link, i) => <Link key={i} link={link} />)
    ) : (
      <Link link={link} />
    )}
  </div>
)

export default EventSessionLink
