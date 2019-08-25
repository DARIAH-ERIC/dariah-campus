import React from 'react'
import clsx from 'clsx'

import DefaultAvatar from 'components/DefaultAvatar/DefaultAvatar'
import Image from 'components/Image/Image'
import Link from 'components/Link/Link'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

import styles from './PostMetadata.module.css'

const getNames = (entities, basePath) =>
  entities.map((entity, i) => (
    <React.Fragment key={entity.slug}>
      {i ? ', ' : null}
      <Link key={entity.slug} to={createPath(basePath, entity.slug)}>
        {entity.name}
      </Link>
    </React.Fragment>
  ))

const PostMetadata = ({ className, metadata }) => (
  <div className={clsx(styles.metadata, className)}>
    <div className={styles.metadataLeft}>
      <div className={styles.metadataImageContainer}>
        {metadata.authors && metadata.authors.length
          ? metadata.authors.map(author =>
              author.avatar ? (
                <Image
                  key={author.id}
                  className={styles.metadataImage}
                  fixed={author.avatar.image.fixed}
                />
              ) : (
                <DefaultAvatar className={styles.metadataImage} />
              )
            )
          : null}
      </div>
      <div>
        {metadata.authors && metadata.authors.length ? (
          <div>
            Written by {getNames(metadata.authors, getBasePath('author'))}
          </div>
        ) : null}
        <time>{metadata.date}</time>
      </div>
    </div>
    <div className={styles.metadataRight}>
      {metadata.categories && metadata.categories.length ? (
        <div>
          Source: {getNames(metadata.categories, getBasePath('category'))}
        </div>
      ) : null}
      {metadata.tags && metadata.tags.length ? (
        <div>Topics: {getNames(metadata.tags, getBasePath('tag'))}</div>
      ) : null}
    </div>
  </div>
)

export default PostMetadata
