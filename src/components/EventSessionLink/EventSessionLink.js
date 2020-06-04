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

/* If there is more than one link attached, we can do:
<Link
  links={[
    'https://prezi.com/ckdl-wi8a6vi/reseaux-du-structuralisme/',
    'http://acta.structuralica.org/2016/08/01/209/',
  ]}
/>

or, in a slightly more clunky fashion, if we want to display the text which is different from the link:

 <Link
   links={[
     {url:'https://prezi.com/ckdl-wi8a6vi/reseaux-du-structuralisme/', text:'Reseaux du structuralisme'},
     {url:'http://acta.structuralica.org/2016/08/01/209/', text:'someothertitle'}
   ]}
 />

*/
const EventSessionLink = ({ link, links, children }) => (
  <div className="session__downloads">
    {links ? (
      links.map((link, i) => (
        <Link key={i} link={link.url ? link.url : link}>
          {link.text ? link.text : link.url}
        </Link>
      ))
    ) : (
      <Link link={link}>{children}</Link>
    )}
  </div>
)

export default EventSessionLink
