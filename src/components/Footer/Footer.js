import React from 'react'
import clsx from 'clsx'

import CCBY from 'components/CCBY/CCBY'
import EUFlag from 'components/EUFlag/EUFlag'
import Link from 'components/Link/Link'
import SocialLinks from 'components/SocialLinks/SocialLinks'

import Container from 'elements/Container/Container'

import { getBasePath } from 'utils/get-base-path'

import styles from './Footer.module.css'

const NavLink = props => (
  <Link
    activeClassName={styles.activeNavLink}
    className={styles.navLink}
    {...props}
  />
)

const Footer = ({ className }) => (
  <footer className={clsx(styles.footer, className)}>
    <Container>
      <nav className={styles.nav}>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <NavLink to="/">Home</NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to={getBasePath('posts')}>Resources</NavLink>
          </li>
          {/* <li className={styles.navItem}>
            <NavLink to={getBasePath('authors')}>Authors</NavLink>
          </li> */}
          <li className={styles.navItem}>
            <NavLink to={getBasePath('tags')}>Topics</NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to={getBasePath('categories')}>Sources</NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/course-registry">Course Registry</NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/about">About</NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="https://www.dariah.eu/helpdesk/">Contact</NavLink>
          </li>
        </ul>
      </nav>
      <SocialLinks className={styles.social} />
      <div className={styles.smallPrint}>
        <div className={styles.smallPrintItem}>
          <div className={styles.smallPrintItemImage}>
            <EUFlag />
          </div>
          <div className={styles.smallPrintItemText}>
            Co-funded by the Horizon 2020 innovation and research programme of
            the European Union under grant no. 731081.
          </div>
        </div>
        <div className={styles.smallPrintItem}>
          <div className={styles.smallPrintItemText}>
            Except where otherwise noted, content on this site is licensed under
            a{' '}
            <Link
              to="https://creativecommons.org/licenses/by/4.0/"
              rel="license"
            >
              Creative Commons Attribution 4.0 International license
            </Link>
            .
          </div>
          <div className={styles.smallPrintItemImage}>
            <CCBY />
          </div>
        </div>
      </div>
    </Container>
  </footer>
)

export default Footer
