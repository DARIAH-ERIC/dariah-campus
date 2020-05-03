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
import Heading from 'elements/Heading/Heading'

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
        {/* <DateTime>{frontmatter.date}</DateTime> */}
        {/* I don't want Paragraph here because I want to styles
          this text differently from the post paragraphs */}
        <div className={styles.text}>{frontmatter.abstract || excerpt}</div>
      </Card.Body>
      <Card.Footer>
        {/*
        it turns out we have some resources with 10 and more authors
        so we can really display only the first three here
        */}
        {frontmatter.authors
          ? frontmatter.authors
              .filter((i, index) => index < 3)
              .map(author =>
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
