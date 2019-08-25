import React from 'react'

import Image from 'components/Image/Image'
import PostsCount from 'components/PostsCount/PostsCount'
import ReadMoreLink from 'components/ReadMoreLink/ReadMoreLink'

import Card from 'elements/Card/Card'
import Heading from 'elements/Heading/Heading'
import Paragraph from 'elements/Paragraph/Paragraph'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

import styles from './AuthorPreview.module.css'

const AuthorPreview = ({
  avatar,
  className,
  description,
  name,
  posts,
  slug,
}) => {
  const path = createPath(getBasePath('author'), slug)

  return (
    <Card className={className}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image className={styles.image} fixed={avatar.image.fixed} />
        </div>

        <Card.Body>
          <Heading>
            <ReadMoreLink posts={posts} to={path}>
              {name}
            </ReadMoreLink>
          </Heading>
          <PostsCount posts={posts} />
          <Paragraph>{description}</Paragraph>
          <ReadMoreLink posts={posts} to={path} />
        </Card.Body>
      </div>
    </Card>
  )
}

export default AuthorPreview
