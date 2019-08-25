import React from 'react'

import Image from 'components/Image/Image'
import PostsCount from 'components/PostsCount/PostsCount'
import ReadMoreLink from 'components/ReadMoreLink/ReadMoreLink'

import Card from 'elements/Card/Card'
import Heading from 'elements/Heading/Heading'
import Paragraph from 'elements/Paragraph/Paragraph'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

import styles from './CategoryPreview.module.css'

const CategoryPreview = ({
  className,
  description,
  image,
  name,
  posts,
  slug,
}) => {
  const path = createPath(getBasePath('category'), slug)

  return (
    <Card className={className}>
      {image && (
        <Card.Header>
          <div className={styles.imageContainer}>
            <Image fluid={image.image.fluid} className={styles.image} />
          </div>
        </Card.Header>
      )}
      <Card.Body>
        <Heading>
          <ReadMoreLink posts={posts} to={path}>
            {name}
          </ReadMoreLink>
        </Heading>
        <Paragraph>{description}</Paragraph>
      </Card.Body>
      <Card.Footer>
        <PostsCount posts={posts} />
        <ReadMoreLink className={styles.readMoreLink} posts={posts} to={path} />
      </Card.Footer>
    </Card>
  )
}

export default CategoryPreview
