import React from 'react'
import { FaCloud } from 'react-icons/fa'

// For event session links -- in addition to:
// <Link link="https://hal.inria.fr/hal-01416978"/>
// we can now do:
// <Link link="https://hal.inria.fr/hal-01416978">Get full paper from HAL</Link>
// i.e. we can control the string displayed to the end user
const Link = ({ link, children }) => (
  <a
    href={link}
    className="link-download"
    style={{ display: 'flex', alignItems: 'center' }}
  >
    <span>
      <FaCloud color="#ed6f59" size="1.8em" style={{ marginRight: '0.8rem' }} />
    </span>
    <strong>{children ? children : link}</strong>
  </a>
)

/* If there is more than one link attached, we can't yet control the string displayed, i.e. it's still possible to do only:
<Link
  links={[
    'https://prezi.com/ckdl-wi8a6vi/reseaux-du-structuralisme/',
    'http://acta.structuralica.org/2016/08/01/209/',
  ]}
/>
*/
const EventSessionLink = ({ link, links, children }) => (
  <div className="session__downloads">
    {links ? (
      links.map((link, i) => <Link key={i} link={link} />)
    ) : (
      <Link link={(link, children)} />
    )}
  </div>
)

export default EventSessionLink
