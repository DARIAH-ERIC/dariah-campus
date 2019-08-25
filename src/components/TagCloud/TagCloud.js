import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import Link from 'components/Link/Link'

import Button from 'elements/Button/Button'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

import styles from './TagCloud.module.css'

const TagCloud = () => {
  const { tags } = useStaticQuery(graphql`
    query {
      tags: allTag(
        filter: { posts: { elemMatch: { id: { ne: null } } } }
        sort: { fields: [slug], order: [ASC] }
      ) {
        nodes {
          id
          name
          posts {
            id
          }
          slug
        }
      }
    }
  `)

  const basePath = getBasePath('tag')

  return (
    <div className={styles.tags}>
      {tags.nodes.map(tag => (
        <Button
          as={Link}
          className={styles.tag}
          key={tag.id}
          primary
          to={createPath(basePath, tag.slug)}
        >
          {tag.name} <sup>{tag.posts ? tag.posts.length : 0}</sup>
        </Button>
      ))}
    </div>
  )
}

export default TagCloud
