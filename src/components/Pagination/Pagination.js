import React from 'react'
import clsx from 'clsx'

import Link from 'components/Link/Link'

import { createPath } from 'utils/create-path'
import { getBasePath } from 'utils/get-base-path'

import styles from './Pagination.module.css'

const Pagination = ({
  path,
  slug,
  className,
  currentPage,
  hasPreviousPage,
  hasNextPage,
  // itemCount,
  pageCount,
  // perPage,
  // totalCount,
}) => {
  const basePath = getBasePath(path)
  return (
    <div className={clsx(styles.pagination, className)}>
      {hasPreviousPage ? (
        <Link
          to={createPath(
            basePath,
            slug,
            currentPage > 2 ? currentPage - 1 : null
          )}
        >
          &larr; Previous
        </Link>
      ) : (
        <div />
      )}
      <div>{/* This is page {currentPage} of {pageCount} */}</div>
      {hasNextPage ? (
        <Link to={createPath(basePath, slug, currentPage + 1)}>
          Next &rarr;
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}

export default Pagination
