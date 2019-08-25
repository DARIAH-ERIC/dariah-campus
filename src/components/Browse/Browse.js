import React from 'react'
import clsx from 'clsx'
import { FaCogs, FaFolderOpen, FaUsers } from 'react-icons/fa'

import Link from 'components/Link/Link'

import Card from 'elements/Card/Card'
import Heading from 'elements/Heading/Heading'
import LeadIn from 'elements/LeadIn/LeadIn'
import Section from 'elements/Section/Section'
import Title from 'elements/Title/Title'

import { getBasePath } from 'utils/get-base-path'
import { createPath } from 'utils/create-path'

import styles from './Browse.module.css'

const Browse = ({ className }) => (
  <Section className={clsx(styles.section, className)}>
    <Title>Browse content</Title>
    <LeadIn>Choose a category to browse or search above</LeadIn>
    <div className={styles.container}>
      <Link to={getBasePath('posts')} className={styles.item}>
        <Card className={styles.card}>
          <Card.Body className={styles.cardBody}>
            <FaCogs color="var(--color-primary)" size="5em" />
            <Heading className={styles.cardHeading}>DARIAH Resources</Heading>
            <div className={styles.cardText}>
              Learn about different topics with online resources provided by
              DARIAH
            </div>
          </Card.Body>
        </Card>
      </Link>
      <Link
        to={createPath(getBasePath('category'), 'events')}
        className={styles.item}
      >
        <Card className={styles.card}>
          <Card.Body className={styles.cardBody}>
            <FaUsers color="var(--color-primary)" size="5em" />
            <Heading className={styles.cardHeading}>DARIAH Events</Heading>
            <div className={styles.cardText}>
              Missed a face-to-face DARIAH event? Check out what happened
            </div>
          </Card.Body>
        </Card>
      </Link>
      <Link
        to={createPath(getBasePath('category'), 'dariah-pathfinders')}
        className={styles.item}
      >
        <Card className={styles.card}>
          <Card.Body className={styles.cardBody}>
            <FaFolderOpen color="var(--color-primary)" size="5em" />
            <Heading className={styles.cardHeading}>DARIAH Pathfinders</Heading>
            <div className={styles.cardText}>
              Useful collections of external resources curated by the DARIAH
              team
            </div>
          </Card.Body>
        </Card>
      </Link>
    </div>
  </Section>
)

export default Browse
