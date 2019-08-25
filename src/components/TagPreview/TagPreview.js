import React from 'react'

import PostsCount from 'components/PostsCount/PostsCount'
import ReadMoreLink from 'components/ReadMoreLink/ReadMoreLink'

import Card from 'elements/Card/Card'
import Heading from 'elements/Heading/Heading'
import Paragraph from 'elements/Paragraph/Paragraph'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

const TagPreview = ({ className, description, name, posts, slug }) => {
  const path = createPath(getBasePath('tag'), slug)

  return (
    <Card className={className}>
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
    </Card>
  )
}

export default TagPreview
