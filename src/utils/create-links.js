import React from 'react'

import Link from 'components/Link/Link'

import { createPath } from 'utils/create-path'

export const createLinks = (entities, basePath) =>
  entities.map((entity, i) => (
    <React.Fragment key={entity.slug}>
      {i ? ', ' : null}
      <Link key={entity.slug} to={createPath(basePath, entity.slug)}>
        {entity.name}
      </Link>
    </React.Fragment>
  ))
