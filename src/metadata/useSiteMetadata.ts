import { useContext } from 'react'

import { MissingContextProviderError } from '@/error/MissingContextProviderError'
import { SiteMetadataContext } from '@/metadata/SiteMetadata.context'
import type { SiteMetadata } from '~/config/siteMetadata.config'

/**
 * Returns site metadata for the currently active locale.
 */
export function useSiteMetadata(): SiteMetadata {
  const metadata = useContext(SiteMetadataContext)

  if (metadata === null) {
    throw new MissingContextProviderError(
      'useSiteMetadata',
      'SiteMetadataProvider',
    )
  }

  return metadata
}
