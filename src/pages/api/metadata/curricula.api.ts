import type { NextApiRequest, NextApiResponse } from 'next'

import { createUrl } from '@/utils/createUrl'
import { log } from '@/utils/log'

/**
 * Returns metadata for curricula (optionally paginated).
 *
 * Metadata has already been parsed at build time and dumped in the public
 * folder by `scripts/dumpMetadata`.
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  try {
    const fetchedFileResponse = await fetch(
      String(
        createUrl({
          pathname: '/metadata/curricula.json',
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        }),
      ),
    )

    if (!fetchedFileResponse.ok) {
      throw new Error('Failed to fetch file.')
    }

    const fileContent = await fetchedFileResponse.json()

    if (request.query.offset == null && request.query.limit == null) {
      return response.json(fileContent)
    }

    if (Array.isArray(request.query.offset)) {
      return response.status(400).end()
    }

    const offset = Number(request.query.offset ?? 0)
    if (Number.isNaN(offset) || !Number.isInteger(offset)) {
      return response.status(400).end()
    }

    const providedLimit = Number(request.query.limit ?? 10)
    if (Number.isNaN(providedLimit) || !Number.isInteger(providedLimit)) {
      return response.status(400).end()
    }
    const limit = Math.min(providedLimit, 100)

    const { curricula } = fileContent

    return response.json({
      curricula: curricula.slice(offset, offset + limit),
      offset,
      limit,
      total: curricula.length,
    })
  } catch (error) {
    log.error(error)
    return response.status(500).end()
  }
}
