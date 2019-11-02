import React from 'react'
import {
  FaBookOpen,
  FaCameraRetro,
  FaLayerGroup,
  FaLink,
  FaMicrophoneAlt,
  FaUsers,
  FaVideo,
  FaDirections,
} from 'react-icons/fa'

import DefaultAvatar from 'components/DefaultAvatar/DefaultAvatar'
import Image from 'components/Image/Image'
import Link from 'components/Link/Link'

import Card from 'elements/Card/Card'
import DateTime from 'elements/DateTime/DateTime'
import Heading from 'elements/Heading/Heading'
import Paragraph from 'elements/Paragraph/Paragraph'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

import styles from './PostPreview.module.css'

const icons = {
  audio: FaMicrophoneAlt,
  book: FaBookOpen,
  images: FaCameraRetro,
  people: FaUsers,
  slides: FaLayerGroup,
  video: FaVideo,
  website: FaLink,
  directions: FaDirections,
}

const PostPreview = ({ className, excerpt, frontmatter, next, previous }) => {
  const path = createPath(getBasePath('post'), frontmatter.slug)

  const ResourceTypeIcon = frontmatter.type
    ? icons[frontmatter.type.icon] || null
    : null

  return (
    <Card className={className}>
      <Card.Body>
        <Heading>
          <Link to={path}>
            {ResourceTypeIcon && (
              <ResourceTypeIcon
                color="var(--color-primary)"
                size="0.75em"
                style={{ marginRight: '1rem' }}
              />
            )}
            {frontmatter.title}
          </Link>
        </Heading>
        <DateTime>{frontmatter.date}</DateTime>
        <Paragraph className={styles.text}>
          {frontmatter.abstract || excerpt}
        </Paragraph>
      </Card.Body>
      <Card.Footer>
        {frontmatter.authors
          ? frontmatter.authors.map(author =>
              author.avatar ? (
                <Image
                  key={author.slug}
                  className={styles.authorImage}
                  fixed={author.avatar.image.fixed}
                />
              ) : (
                <DefaultAvatar className={styles.authorImage} />
              )
            )
          : null}
        <Link className={styles.readMoreLink} to={path}>
          Read more &rarr;
        </Link>
      </Card.Footer>
    </Card>
  )
}

export default PostPreview
