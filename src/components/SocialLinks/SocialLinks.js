import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import clsx from 'clsx'
import {
  FaEnvelope,
  FaFlickr,
  FaGithub,
  FaLink,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'
import Link from 'components/Link/Link'

import styles from './SocialLinks.module.css'

const icons = {
  twitter: FaTwitter,
  flickr: FaFlickr,
  youtube: FaYoutube,
  github: FaGithub,
  email: FaEnvelope,
  website: FaLink,
}

const SocialLinks = ({ className }) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          social {
            name
            url
          }
        }
      }
    }
  `)
  return (
    <ul className={clsx(styles.socialItems, className)}>
      {site.siteMetadata.social.map(({ name, url }) => {
        const Icon = icons[name]
        return (
          <li className={styles.socialItem} key={name}>
            <Link className={styles.socialLink} to={url}>
              <Icon />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default SocialLinks
